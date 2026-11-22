-- +goose Up
CREATE TABLE themes (
    id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 text NOT NULL UNIQUE,
    background           text NOT NULL,
    foreground           text NOT NULL,
    card                 text NOT NULL,
    card_foreground      text NOT NULL,
    primary_color        text NOT NULL,
    primary_foreground   text NOT NULL,
    secondary            text NOT NULL,
    secondary_foreground text NOT NULL,
    muted                text NOT NULL,
    muted_foreground     text NOT NULL,
    accent               text NOT NULL,
    accent_foreground    text NOT NULL,
    destructive          text NOT NULL,
    border               text NOT NULL,
    input                text NOT NULL,
    ring                 text NOT NULL,
    deleted_at           timestamptz
);

INSERT INTO themes (
    name, background, foreground, card, card_foreground, primary_color, primary_foreground,
    secondary, secondary_foreground, muted, muted_foreground, accent, accent_foreground,
    destructive, border, input, ring
) VALUES
    ('light',
     'oklch(1 0 0)', 'oklch(0.145 0 0)', 'oklch(1 0 0)', 'oklch(0.145 0 0)',
     'oklch(0.205 0 0)', 'oklch(0.985 0 0)', 'oklch(0.97 0 0)', 'oklch(0.205 0 0)',
     'oklch(0.97 0 0)', 'oklch(0.556 0 0)', 'oklch(0.97 0 0)', 'oklch(0.205 0 0)',
     'oklch(0.577 0.245 27.325)', 'oklch(0.922 0 0)', 'oklch(0.922 0 0)', 'oklch(0.708 0 0)'),
    ('dark',
     'oklch(0.145 0 0)', 'oklch(0.985 0 0)', 'oklch(0.205 0 0)', 'oklch(0.985 0 0)',
     'oklch(0.922 0 0)', 'oklch(0.205 0 0)', 'oklch(0.269 0 0)', 'oklch(0.985 0 0)',
     'oklch(0.269 0 0)', 'oklch(0.708 0 0)', 'oklch(0.269 0 0)', 'oklch(0.985 0 0)',
     'oklch(0.577 0.245 27.325)', 'oklch(1 0 0 / 10%)', 'oklch(1 0 0 / 15%)', 'oklch(0.556 0 0)'),
    ('catppuccin-mocha',
     '#1e1e2e', '#cdd6f4', '#181825', '#cdd6f4',
     '#cba6f7', '#11111b', '#313244', '#cdd6f4',
     '#313244', '#a6adc8', '#45475a', '#cdd6f4',
     '#f38ba8', '#45475a', '#45475a', '#b4befe'),
    ('tokyo-night',
     '#1a1b26', '#c0caf5', '#24283b', '#c0caf5',
     '#7aa2f7', '#1a1b26', '#292e42', '#c0caf5',
     '#292e42', '#565f89', '#3b4261', '#c0caf5',
     '#f7768e', '#3b4261', '#3b4261', '#7aa2f7');

ALTER TABLE settings ADD COLUMN theme_id bigint REFERENCES themes (id);

-- +goose Down
ALTER TABLE settings DROP COLUMN theme_id;
DROP TABLE themes;
