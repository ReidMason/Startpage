package oidctest

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// New starts a stub OIDC provider serving discovery and an empty JWKS; its URL is the issuer.
func New(t *testing.T) *httptest.Server {
	t.Helper()
	mux := http.NewServeMux()
	var ts *httptest.Server
	mux.HandleFunc("/.well-known/openid-configuration", func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewEncoder(w).Encode(map[string]any{
			"issuer":                                ts.URL,
			"authorization_endpoint":                ts.URL + "/authorize",
			"token_endpoint":                        ts.URL + "/token",
			"jwks_uri":                              ts.URL + "/jwks",
			"response_types_supported":              []string{"code"},
			"subject_types_supported":               []string{"public"},
			"id_token_signing_alg_values_supported": []string{"RS256"},
		})
	})
	mux.HandleFunc("/jwks", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`{"keys":[]}`))
	})
	ts = httptest.NewServer(mux)
	t.Cleanup(ts.Close)
	return ts
}
