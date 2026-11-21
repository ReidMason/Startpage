-- name: LockUser :exec
SELECT id FROM users WHERE id = $1 FOR UPDATE;

-- name: CreateFirstGroupIfNone :exec
INSERT INTO groups (user_id, position)
SELECT @user_id, 0
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE user_id = @user_id);

-- name: ListGroups :many
SELECT id, name, style, collapsed
FROM groups
WHERE user_id = $1
ORDER BY position, id;

-- name: ListLiveApps :many
SELECT a.id, a.group_id, a.name, a.url, a.icon_name, a.icon_svg
FROM apps a
JOIN groups g ON g.id = a.group_id
WHERE g.user_id = $1 AND a.deleted_at IS NULL
ORDER BY a.position, a.id;

-- name: FirstGroupID :one
SELECT id FROM groups WHERE user_id = $1 ORDER BY position, id LIMIT 1;

-- name: CreateApp :one
INSERT INTO apps (group_id, name, url, icon_name, icon_svg, position)
SELECT g.id, @name, @url, @icon_name, @icon_svg,
       COALESCE((SELECT max(position) + 1 FROM apps WHERE group_id = g.id), 0)
FROM groups g
WHERE g.id = @group_id AND g.user_id = @user_id
RETURNING id, name, url, icon_name, icon_svg;

-- name: UpdateApp :one
UPDATE apps SET name = @name, url = @url, icon_name = @icon_name, icon_svg = @icon_svg
WHERE apps.id = @id AND apps.deleted_at IS NULL
  AND apps.group_id IN (SELECT g.id FROM groups g WHERE g.user_id = @user_id)
RETURNING id, name, url, icon_name, icon_svg;

-- name: DeleteApp :execrows
UPDATE apps SET deleted_at = now()
WHERE apps.id = @id AND apps.deleted_at IS NULL
  AND apps.group_id IN (SELECT g.id FROM groups g WHERE g.user_id = @user_id);

-- name: RenumberGroupAppsAfterRestore :exec
WITH ordered AS (
    SELECT a.id, row_number() OVER (ORDER BY a.position, (a.id <> @id), a.id) - 1 AS new_position
    FROM apps a
    WHERE a.deleted_at IS NULL
      AND a.group_id = (SELECT d.group_id FROM apps d WHERE d.id = @id)
)
UPDATE apps SET position = ordered.new_position
FROM ordered
WHERE apps.id = ordered.id AND apps.position <> ordered.new_position;

-- name: RestoreApp :one
UPDATE apps SET deleted_at = NULL
WHERE apps.id = @id AND apps.deleted_at IS NOT NULL
  AND apps.group_id IN (SELECT g.id FROM groups g WHERE g.user_id = @user_id)
RETURNING id, name, url, icon_name, icon_svg;

-- name: CreateGroup :one
INSERT INTO groups (user_id, name, position)
VALUES (@user_id, @name, COALESCE((SELECT max(position) + 1 FROM groups WHERE user_id = @user_id), 0))
RETURNING id, name, style, collapsed;

-- name: UpdateGroup :execrows
UPDATE groups SET
    name = COALESCE(sqlc.narg('name'), name),
    style = COALESCE(sqlc.narg('style'), style),
    collapsed = COALESCE(sqlc.narg('collapsed'), collapsed)
WHERE id = @id AND user_id = @user_id;
