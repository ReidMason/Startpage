package server

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
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
)

type auth struct {
	oauth    *oauth2.Config
	verifier *oidc.IDTokenVerifier
	queries  *dbgen.Queries
	logger   *slog.Logger
}

func (a *auth) register(mux *http.ServeMux) {
	mux.HandleFunc("GET /auth/login", a.login)
	mux.HandleFunc("GET /auth/callback", a.callback)
	mux.HandleFunc("GET /api/me", a.me)
}

func (a *auth) login(w http.ResponseWriter, r *http.Request) {
	state, nonce := randomID(), randomID()
	http.SetCookie(w, &http.Cookie{
		Name: loginCookie, Value: state + "." + nonce, Path: "/auth",
		MaxAge: int(loginStateTTL.Seconds()), HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode,
	})
	http.Redirect(w, r, a.oauth.AuthCodeURL(state, oidc.Nonce(nonce)), http.StatusFound)
}

func (a *auth) callback(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie(loginCookie)
	state, nonce, ok := strings.Cut(valueOf(c), ".")
	if err != nil || !ok || state == "" || r.URL.Query().Get("state") != state {
		http.Error(w, "invalid login state", http.StatusBadRequest)
		return
	}
	http.SetCookie(w, &http.Cookie{Name: loginCookie, Path: "/auth", MaxAge: -1, HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode})

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
	}); err != nil {
		a.internalError(w, err)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name: sessionCookie, Value: sessionID, Path: "/", Expires: expires,
		HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode,
	})
	http.Redirect(w, r, "/", http.StatusFound)
}

func (a *auth) me(w http.ResponseWriter, r *http.Request) {
	user, err := a.currentUser(r.Context(), r)
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

func valueOf(c *http.Cookie) string {
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
