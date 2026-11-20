-- +goose Up
ALTER TABLE sessions ADD COLUMN revoked_at timestamptz;

-- +goose Down
ALTER TABLE sessions DROP COLUMN revoked_at;
