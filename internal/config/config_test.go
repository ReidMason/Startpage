package config_test

import (
	"strings"
	"testing"

	"github.com/ReidMason/startpage/internal/config"
)

func validEnv() map[string]string {
	return map[string]string{
		"DATABASE_URL":       "postgres://db",
		"PUBLIC_BASE_URL":    "https://start.example.com/",
		"OIDC_ISSUER_URL":    "https://auth.example.com/application/o/startpage/",
		"OIDC_CLIENT_ID":     "client",
		"OIDC_CLIENT_SECRET": "secret",
	}
}

func TestLoadReadsEnvironment(t *testing.T) {
	env := validEnv()
	cfg, err := config.Load(func(k string) string { return env[k] })
	if err != nil {
		t.Fatal(err)
	}
	if cfg.DatabaseURL != "postgres://db" || cfg.OIDCClientID != "client" || cfg.OIDCClientSecret != "secret" {
		t.Errorf("unexpected config: %+v", cfg)
	}
	if got, want := cfg.RedirectURI(), "https://start.example.com/auth/callback"; got != want {
		t.Errorf("RedirectURI = %q, want %q", got, want)
	}
}

func TestLoadNamesEachMissingVariable(t *testing.T) {
	for name := range validEnv() {
		t.Run(name, func(t *testing.T) {
			env := validEnv()
			delete(env, name)
			_, err := config.Load(func(k string) string { return env[k] })
			if err == nil {
				t.Fatal("expected error")
			}
			if !strings.Contains(err.Error(), name) || !strings.Contains(err.Error(), "README") {
				t.Errorf("error %q should name %s and reference the README", err, name)
			}
		})
	}
}

func TestLoadRejectsInvalidPublicBaseURL(t *testing.T) {
	env := validEnv()
	env["PUBLIC_BASE_URL"] = "not a url"
	_, err := config.Load(func(k string) string { return env[k] })
	if err == nil || !strings.Contains(err.Error(), "PUBLIC_BASE_URL") {
		t.Errorf("err = %v, want one naming PUBLIC_BASE_URL", err)
	}
}
