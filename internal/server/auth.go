package server

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/oauth2"

	"github.com/ReidMason/startpage/internal/db/dbgen"
)

const (
	sessionCookie  = "startpage_session"
	loginCookie    = "startpage_login"
	sessionTTL     = 30 * 24 * time.Hour
	loginStateTTL  = 10 * time.Minute
	randomIDLength = 32
	slideThreshold = time.Hour
)

type auth struct {
	oauth    *oauth2.Config
	verifier *oidc.IDTokenVerifier
	queries  *dbgen.Queries
	logger   *slog.Logger

	endSessionEndpoint string
	postLogoutURL      string
}

func (a *auth) register(mux *http.ServeMux) {
	mux.HandleFunc("GET /auth/login", a.login)
	mux.HandleFunc("GET /auth/callback", a.callback)
	mux.HandleFunc("GET /api/me", a.me)
	mux.HandleFunc("POST /auth/logout", a.logout)
}

func (a *auth) login(w http.ResponseWriter, r *http.Request) {
	state, nonce := randomID(), randomID()
	loginState := secureCookie(loginCookie, state+"."+nonce, "/auth")
	loginState.MaxAge = int(loginStateTTL.Seconds())
	http.SetCookie(w, loginState)
	http.Redirect(w, r, a.oauth.AuthCodeURL(state, oidc.Nonce(nonce)), http.StatusFound)
}

func (a *auth) callback(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie(loginCookie)
	state, nonce, ok := strings.Cut(cookieValue(c), ".")
	if err != nil || !ok || state == "" || subtle.ConstantTimeCompare([]byte(r.URL.Query().Get("state")), []byte(state)) != 1 {
		http.Error(w, "invalid login state", http.StatusBadRequest)
		return
	}
	http.SetCookie(w, clearedCookie(loginCookie, "/auth"))
	if providerErr := r.URL.Query().Get("error"); providerErr != "" {
		a.logger.Warn("provider returned error", "error", providerErr, "description", r.URL.Query().Get("error_description"))
		http.Error(w, "sign-in was not completed by the identity provider", http.StatusBadRequest)
		return
	}

	token, err := a.oauth.Exchange(r.Context(), r.URL.Query().Get("code"))
	if err != nil {
		a.logger.Warn("code exchange failed", "error", err)
		http.Error(w, "sign-in failed", http.StatusBadGateway)
		return
	}
	rawID, _ := token.Extra("id_token").(string)
	idToken, err := a.verifier.Verify(r.Context(), rawID)
	if err != nil || idToken.Nonce != nonce {
		a.logger.Warn("id token rejected", "error", err)
		http.Error(w, "sign-in failed", http.StatusUnauthorized)
		return
	}
	var claims struct {
		Name              string `json:"name"`
		PreferredUsername string `json:"preferred_username"`
	}
	if err := idToken.Claims(&claims); err != nil {
		http.Error(w, "sign-in failed", http.StatusUnauthorized)
		return
	}

	userID, err := a.queries.UpsertUser(r.Context(), dbgen.UpsertUserParams{
		OidcSubject: idToken.Subject,
		DisplayName: firstNonEmpty(claims.Name, claims.PreferredUsername, idToken.Subject),
	})
	if err != nil {
		a.internalError(w, err)
		return
	}
	sessionID := randomID()
	expires := time.Now().Add(sessionTTL)
	if err := a.queries.CreateSession(r.Context(), dbgen.CreateSessionParams{
		IDHash: hashID(sessionID), UserID: userID, ExpiresAt: pgTime(expires),
		IDToken: pgtype.Text{String: rawID, Valid: true},
	}); err != nil {
		a.internalError(w, err)
		return
	}
	setSessionCookie(w, sessionID, expires)
	http.Redirect(w, r, "/", http.StatusFound)
}

func (a *auth) logout(w http.ResponseWriter, r *http.Request) {
	var idToken string
	if c, err := r.Cookie(sessionCookie); err == nil && c.Value != "" {
		stored, err := a.queries.DeleteSession(r.Context(), hashID(c.Value))
		if err != nil && !errors.Is(err, pgx.ErrNoRows) {
			a.internalError(w, err)
			return
		}
		idToken = stored.String
	}
	http.SetCookie(w, clearedCookie(sessionCookie, "/"))
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{"redirectUrl": a.postLogoutTarget(idToken)})
}

// postLogoutTarget is the provider's end-session URL when it has one, so the provider's own SSO session ends too.
func (a *auth) postLogoutTarget(idToken string) string {
	if a.endSessionEndpoint == "" {
		return a.postLogoutURL
	}
	u, err := url.Parse(a.endSessionEndpoint)
	if err != nil {
		return a.postLogoutURL
	}
	q := u.Query()
	q.Set("post_logout_redirect_uri", a.postLogoutURL)
	if idToken != "" {
		q.Set("id_token_hint", idToken)
	}
	u.RawQuery = q.Encode()
	return u.String()
}

func setSessionCookie(w http.ResponseWriter, id string, expires time.Time) {
	c := secureCookie(sessionCookie, id, "/")
	c.Expires = expires
	http.SetCookie(w, c)
}

func secureCookie(name, value, path string) *http.Cookie {
	return &http.Cookie{Name: name, Value: value, Path: path, HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode}
}

func clearedCookie(name, path string) *http.Cookie {
	c := secureCookie(name, "", path)
	c.MaxAge = -1
	return c
}

func (a *auth) me(w http.ResponseWriter, r *http.Request) {
	user, err := a.currentUser(r.Context(), r)
	if err == nil {
		err = a.slide(w, r, user.ExpiresAt.Time)
	}
	if errors.Is(err, errUnauthenticated) {
		http.Error(w, "unauthenticated", http.StatusUnauthorized)
		return
	}
	if err != nil {
		a.internalError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	_ = json.NewEncoder(w).Encode(map[string]string{"displayName": user.DisplayName})
}

var errUnauthenticated = errors.New("unauthenticated")

func (a *auth) currentUser(ctx context.Context, r *http.Request) (dbgen.GetUserBySessionHashRow, error) {
	c, err := r.Cookie(sessionCookie)
	if err != nil || c.Value == "" {
		return dbgen.GetUserBySessionHashRow{}, errUnauthenticated
	}
	user, err := a.queries.GetUserBySessionHash(ctx, hashID(c.Value))
	if errors.Is(err, pgx.ErrNoRows) {
		return dbgen.GetUserBySessionHashRow{}, errUnauthenticated
	}
	return user, err
}

// slide extends the Session only once a meaningful slice of the TTL has elapsed, so most requests do not write.
func (a *auth) slide(w http.ResponseWriter, r *http.Request, current time.Time) error {
	next := time.Now().Add(sessionTTL)
	if next.Sub(current) < slideThreshold {
		return nil
	}
	c, _ := r.Cookie(sessionCookie)
	if err := a.queries.ExtendSession(r.Context(), dbgen.ExtendSessionParams{IDHash: hashID(c.Value), ExpiresAt: pgTime(next)}); err != nil {
		return err
	}
	setSessionCookie(w, c.Value, next)
	return nil
}

func (a *auth) internalError(w http.ResponseWriter, err error) {
	a.logger.Error("request failed", "error", err)
	http.Error(w, "internal error", http.StatusInternalServerError)
}

func randomID() string {
	b := make([]byte, randomIDLength)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	return base64.RawURLEncoding.EncodeToString(b)
}

func hashID(id string) []byte {
	sum := sha256.Sum256([]byte(id))
	return sum[:]
}

func cookieValue(c *http.Cookie) string {
	if c == nil {
		return ""
	}
	return c.Value
}

func firstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if v != "" {
			return v
		}
	}
	return ""
}

func pgTime(t time.Time) pgtype.Timestamptz {
	return pgtype.Timestamptz{Time: t, Valid: true}
}
