-- name: SetGroupPosition :exec
UPDATE groups SET position = @position WHERE id = @id AND user_id = @user_id;

-- name: SetAppPlacement :exec
UPDATE apps SET group_id = @group_id, position = @position
WHERE apps.id = @id
  AND @group_id IN (SELECT g.id FROM groups g WHERE g.user_id = @user_id);
