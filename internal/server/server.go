package server

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io/fs"
	"log/slog"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"

	"github.com/ReidMason/startpage/internal/config"
	"github.com/ReidMason/startpage/internal/db"
	"github.com/ReidMason/startpage/internal/db/dbgen"
)

type Config struct {
	App    config.Config
	Assets fs.FS
	Logger *slog.Logger
}

// New opens the database, applies migrations, discovers the OIDC provider and returns the HTTP handler plus a cleanup func.
func New(ctx context.Context, cfg Config) (http.Handler, func(), error) {
	logger := cfg.Logger
	if logger == nil {
		logger = slog.Default()
	}
	pool, err := db.Open(ctx, cfg.App.DatabaseURL)
	if err != nil {
		return nil, nil, err
	}
	discoverCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	provider, err := oidc.NewProvider(discoverCtx, cfg.App.OIDCIssuerURL)
	if err != nil {
		pool.Close()
		return nil, nil, fmt.Errorf("OIDC discovery failed for OIDC_ISSUER_URL %q (see README): %w", cfg.App.OIDCIssuerURL, err)
	}
	logger.Info("OIDC ready", "redirect_uri", cfg.App.RedirectURI())
	a := &auth{
		oauth: &oauth2.Config{
			ClientID:     cfg.App.OIDCClientID,
			ClientSecret: cfg.App.OIDCClientSecret,
			Endpoint:     provider.Endpoint(),
			RedirectURL:  cfg.App.RedirectURI(),
			Scopes:       []string{oidc.ScopeOpenID, "profile"},
		},
		verifier: provider.Verifier(&oidc.Config{ClientID: cfg.App.OIDCClientID}),
		queries:  dbgen.New(pool),
		logger:   logger,
	}
	mux := http.NewServeMux()
	a.register(mux)
	mux.Handle("/", staticHandler(cfg.Assets))
	return mux, pool.Close, nil
}

func staticHandler(assets fs.FS) http.Handler {
	hashed := http.FileServerFS(assets)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/assets/") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			hashed.ServeHTTP(w, r)
			return
		}
		name := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		if info, err := fs.Stat(assets, name); err != nil || info.IsDir() {
			name = "index.html"
		}
		data, err := fs.ReadFile(assets, name)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		sum := sha256.Sum256(data)
		w.Header().Set("ETag", `"`+hex.EncodeToString(sum[:16])+`"`)
		w.Header().Set("Cache-Control", "no-cache")
		http.ServeContent(w, r, name, time.Time{}, bytes.NewReader(data))
	})
}
