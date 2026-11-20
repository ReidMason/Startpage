package server_test

import (
	"bytes"
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync/atomic"
	"testing"
	"testing/fstest"

	"github.com/jackc/pgx/v5"
	"github.com/testcontainers/testcontainers-go"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"

	"github.com/ReidMason/startpage/internal/config"
	"github.com/ReidMason/startpage/internal/oidctest"
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

func testConfig(dbURL, issuer string) config.Config {
	return config.Config{
		DatabaseURL:      dbURL,
		PublicBaseURL:    "https://start.example.com",
		OIDCIssuerURL:    issuer,
		OIDCClientID:     "startpage",
		OIDCClientSecret: "super-secret-value",
	}
}

func startServer(t *testing.T) (*httptest.Server, string) {
	t.Helper()
	dbURL := newDatabase(t)
	issuer := oidctest.New(t)
	assets := fstest.MapFS{
		"index.html":          {Data: []byte("<!doctype html><title>startpage</title>")},
		"assets/index-abc.js": {Data: []byte("console.log(1)")},
	}
	h, closeFn, err := server.New(context.Background(), server.Config{App: testConfig(dbURL, issuer.URL), Assets: assets})
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
		App:    testConfig("postgres://x:x@127.0.0.1:1/x?sslmode=disable&connect_timeout=1", oidctest.New(t).URL),
		Assets: fstest.MapFS{},
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

func TestStartupFailsWhenOIDCDiscoveryFails(t *testing.T) {
	issuer := oidctest.New(t)
	issuer.Close()

	_, _, err := server.New(context.Background(), server.Config{
		App:    testConfig(newDatabase(t), issuer.URL),
		Assets: fstest.MapFS{},
	})
	if err == nil {
		t.Fatal("expected error")
	}
	if !strings.Contains(err.Error(), "OIDC_ISSUER_URL") || !strings.Contains(err.Error(), "README") {
		t.Errorf("error %q should name OIDC_ISSUER_URL and reference the README", err)
	}
}

func TestStartupLogsRedirectURIWithoutSecret(t *testing.T) {
	var logs bytes.Buffer
	cfg := testConfig(newDatabase(t), oidctest.New(t).URL)
	_, closeFn, err := server.New(context.Background(), server.Config{
		App:    cfg,
		Assets: fstest.MapFS{},
		Logger: slog.New(slog.NewTextHandler(&logs, nil)),
	})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(closeFn)

	if !strings.Contains(logs.String(), "https://start.example.com/auth/callback") {
		t.Errorf("log should contain the redirect URI, got %q", logs.String())
	}
	if strings.Contains(logs.String(), cfg.OIDCClientSecret) {
		t.Error("log leaks the client secret")
	}
}
