-- +goose Up
CREATE TABLE groups (
    id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id   bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name      text NOT NULL DEFAULT '',
    position  integer NOT NULL,
    style     text NOT NULL DEFAULT 'tiles' CHECK (style IN ('tiles', 'compact')),
    collapsed boolean NOT NULL DEFAULT false
);

CREATE INDEX groups_user_position_idx ON groups (user_id, position);

CREATE TABLE apps (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id   bigint NOT NULL REFERENCES groups (id) ON DELETE CASCADE,
    name       text NOT NULL,
    url        text NOT NULL,
    icon_name  text NOT NULL DEFAULT '',
    icon_svg   text NOT NULL DEFAULT '',
    position   integer NOT NULL,
    deleted_at timestamptz
);

CREATE INDEX apps_group_position_idx ON apps (group_id, position);

-- +goose Down
DROP TABLE apps;
DROP TABLE groups;
