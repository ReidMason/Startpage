-- +goose Up
CREATE TABLE settings (
    user_id               bigint PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    search_engine         text NOT NULL DEFAULT 'https://www.google.com/search?q=',
    show_name_in_greeting boolean NOT NULL DEFAULT false
);

-- +goose Down
DROP TABLE settings;
