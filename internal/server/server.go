package server

import (
	"context"
	"io/fs"
	"net/http"
	"strings"

	"github.com/ReidMason/startpage/internal/db"
)

type Config struct {
	DatabaseURL string
	Assets      fs.FS
}

// New opens the database, applies migrations and returns the HTTP handler plus a cleanup func.
func New(ctx context.Context, cfg Config) (http.Handler, func(), error) {
	pool, err := db.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		return nil, nil, err
	}
	return staticHandler(cfg.Assets), pool.Close, nil
}

func staticHandler(assets fs.FS) http.Handler {
	files := http.FileServerFS(assets)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/assets/") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			files.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Cache-Control", "no-cache")
		if r.URL.Path != "/" && r.URL.Path != "/index.html" {
			if _, err := fs.Stat(assets, strings.TrimPrefix(r.URL.Path, "/")); err != nil {
				r = r.Clone(r.Context())
				r.URL.Path = "/"
			}
		}
		files.ServeHTTP(w, r)
	})
}
