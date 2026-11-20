-- +goose Up
ALTER TABLE sessions ADD COLUMN id_token text;

-- +goose Down
ALTER TABLE sessions DROP COLUMN id_token;
