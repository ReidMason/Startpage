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
-- name: SetGroupCollapsed :execrows
UPDATE groups SET collapsed = @collapsed WHERE id = @id AND user_id = @user_id;

-- name: DeleteApp :execrows
UPDATE apps SET deleted_at = now()
WHERE apps.id = @id AND apps.deleted_at IS NULL
  AND apps.group_id IN (SELECT g.id FROM groups g WHERE g.user_id = @user_id);

-- name: ShiftSiblingsForRestore :exec
UPDATE apps SET position = position + 1
WHERE deleted_at IS NULL
  AND apps.id <> @id
  AND group_id = (SELECT d.group_id FROM apps d WHERE d.id = @id)
  AND position >= (SELECT d.position FROM apps d WHERE d.id = @id);

-- name: RestoreApp :one
UPDATE apps SET deleted_at = NULL
WHERE apps.id = @id AND apps.deleted_at IS NOT NULL
  AND apps.group_id IN (SELECT g.id FROM groups g WHERE g.user_id = @user_id)
RETURNING id, name, url, icon_name, icon_svg;
