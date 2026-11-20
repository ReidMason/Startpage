package server

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io/fs"
	"net/http"
	"path"
	"strings"
	"time"

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
