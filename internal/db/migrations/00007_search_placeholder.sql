-- +goose Up
ALTER TABLE settings ADD COLUMN search_placeholder text NOT NULL DEFAULT 'Search...';

-- +goose Down
ALTER TABLE settings DROP COLUMN search_placeholder;
