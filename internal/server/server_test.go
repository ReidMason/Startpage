package server_test

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"sync/atomic"
	"testing"
	"testing/fstest"

	"github.com/jackc/pgx/v5"
	"github.com/testcontainers/testcontainers-go"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"

	"github.com/ReidMason/startpage/internal/server"
)

var (
	adminURL string
	dbSeq    atomic.Int64
)

func TestMain(m *testing.M) {
	ctx := context.Background()
	pg, err := tcpostgres.Run(ctx, "postgres:17-alpine",
		tcpostgres.WithDatabase("postgres"),
		tcpostgres.WithUsername("test"),
		tcpostgres.WithPassword("test"),
		tcpostgres.BasicWaitStrategies(),
	)
	if err != nil {
		fmt.Fprintln(os.Stderr, "start postgres container:", err)
		os.Exit(1)
	}
	adminURL, err = pg.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	code := m.Run()
	_ = testcontainers.TerminateContainer(pg)
	os.Exit(code)
}

func newDatabase(t *testing.T) string {
	t.Helper()
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, adminURL)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close(ctx)
	name := fmt.Sprintf("test_%d", dbSeq.Add(1))
	if _, err := conn.Exec(ctx, "CREATE DATABASE "+name); err != nil {
		t.Fatal(err)
	}
	cfg := conn.Config().Copy()
	cfg.Database = name
	return cfg.ConnString()
}

func startServer(t *testing.T) (*httptest.Server, string) {
	t.Helper()
	dbURL := newDatabase(t)
	assets := fstest.MapFS{
		"index.html":          {Data: []byte("<!doctype html><title>startpage</title>")},
		"assets/index-abc.js": {Data: []byte("console.log(1)")},
	}
	h, closeFn, err := server.New(context.Background(), server.Config{DatabaseURL: dbURL, Assets: assets})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(closeFn)
	ts := httptest.NewServer(h)
	t.Cleanup(ts.Close)
	return ts, dbURL
}

func TestShellRevalidates(t *testing.T) {
	ts, _ := startServer(t)

	for _, path := range []string{"/", "/index.html"} {
		resp, err := http.Get(ts.URL + path)
		if err != nil {
			t.Fatal(err)
		}
		resp.Body.Close()
		if resp.StatusCode != 200 {
			t.Fatalf("%s: status %d", path, resp.StatusCode)
		}
		if got := resp.Header.Get("Cache-Control"); got != "no-cache" {
			t.Errorf("%s: Cache-Control = %q, want no-cache", path, got)
		}
		if resp.Header.Get("ETag") == "" && resp.Header.Get("Last-Modified") == "" {
			t.Errorf("%s: shell has no validator for revalidation", path)
		}
	}
}

func TestHashedAssetsCacheLong(t *testing.T) {
	ts, _ := startServer(t)

	resp, err := http.Get(ts.URL + "/assets/index-abc.js")
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	if resp.StatusCode != 200 {
		t.Fatalf("status %d", resp.StatusCode)
	}
	if got, want := resp.Header.Get("Cache-Control"), "public, max-age=31536000, immutable"; got != want {
		t.Errorf("Cache-Control = %q, want %q", got, want)
	}
}

func TestMigrationsApplyAtStartup(t *testing.T) {
	_, dbURL := startServer(t)

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close(ctx)
	var applied int
	if err := conn.QueryRow(ctx, "SELECT count(*) FROM goose_db_version WHERE is_applied AND version_id > 0").Scan(&applied); err != nil {
		t.Fatal(err)
	}
	if applied == 0 {
		t.Error("no migrations applied")
	}
}

func TestStartupFailsWhenDatabaseUnreachable(t *testing.T) {
	_, _, err := server.New(context.Background(), server.Config{
		DatabaseURL: "postgres://x:x@127.0.0.1:1/x?sslmode=disable&connect_timeout=1",
		Assets:      fstest.MapFS{},
	})
	if err == nil {
		t.Fatal("expected error")
	}
}

func TestShellAnswersConditionalRequestWith304(t *testing.T) {
	ts, _ := startServer(t)

	first, err := http.Get(ts.URL + "/")
	if err != nil {
		t.Fatal(err)
	}
	first.Body.Close()
	req, _ := http.NewRequest(http.MethodGet, ts.URL+"/", nil)
	req.Header.Set("If-None-Match", first.Header.Get("ETag"))
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusNotModified {
		t.Errorf("status = %d, want 304", resp.StatusCode)
	}
}
