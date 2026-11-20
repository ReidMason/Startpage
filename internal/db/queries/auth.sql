-- name: UpsertUser :one
INSERT INTO users (oidc_subject, display_name)
VALUES ($1, $2)
ON CONFLICT (oidc_subject) DO UPDATE SET display_name = EXCLUDED.display_name
RETURNING id;

-- name: CreateSession :exec
INSERT INTO sessions (id_hash, user_id, expires_at)
VALUES ($1, $2, $3);

-- name: GetUserBySessionHash :one
SELECT u.id, u.display_name
FROM sessions s
JOIN users u ON u.id = s.user_id
WHERE s.id_hash = $1 AND s.expires_at > now();
