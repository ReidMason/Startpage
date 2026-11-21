import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { createApp, createGroup, deleteApp, restoreApp, updateApp, type App as AppModel } from "@/api";
import { AppModal, type AppDraft } from "@/components/AppModal";

import { CollapsibleGroup } from "@/components/CollapsibleGroup";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDisplayName, meQueryKey, readCachedName, signOut } from "@/lib/session";
import { fetchStartpage, readCachedStartpage, startpageQueryKey } from "@/lib/startpage";

type Editing = { kind: "new"; groupId: number } | { kind: "existing"; app: AppModel };

const blankDraft: AppDraft = { name: "", url: "", iconName: "", iconSvg: "" };

export function App() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);
  const save = useMutation({
    mutationFn: async ({ target, draft }: { target: Editing; draft: AppDraft }) => {
      const res =
        target.kind === "new"
          ? await createApp({ body: { ...draft, groupId: target.groupId } })
          : await updateApp({ path: { id: target.app.id }, body: draft });
      if (res.error) throw new Error(`saving app failed: ${res.response?.status}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: startpageQueryKey });
      setEditing(null);
    },
  });
  const [undoable, setUndoable] = useState<AppModel | null>(null);
  useEffect(() => {
    if (!undoable) return;
    const t = setTimeout(() => setUndoable(null), 6000);
    return () => clearTimeout(t);
  }, [undoable]);
  const remove = useMutation({
    mutationFn: async (app: AppModel) => {
      const res = await deleteApp({ path: { id: app.id } });
      if (res.error) throw new Error(`deleting app failed: ${res.response?.status}`);
      return app;
    },
    onSuccess: async (app) => {
      setEditing(null);
      setUndoable(app);
      await queryClient.invalidateQueries({ queryKey: startpageQueryKey });
    },
  });
  const undo = useMutation({
    mutationFn: async (app: AppModel) => {
      const res = await restoreApp({ path: { id: app.id } });
      if (res.error) throw new Error(`restoring app failed: ${res.response?.status}`);
    },
    onSuccess: async () => {
      setUndoable(null);
      await queryClient.invalidateQueries({ queryKey: startpageQueryKey });
    },
  });
  const addGroup = useMutation({
    mutationFn: async () => {
      const res = await createGroup({ body: { name: "New group" } });
      if (res.error) throw new Error(`creating group failed: ${res.response?.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: startpageQueryKey }),
  });
  const { data: name } = useQuery({
    queryKey: meQueryKey,
    queryFn: fetchDisplayName,
    initialData: readCachedName,
    initialDataUpdatedAt: 0,
    retry: false,
  });
  const { data: startpage } = useQuery({
    queryKey: startpageQueryKey,
    queryFn: fetchStartpage,
    initialData: readCachedStartpage,
    initialDataUpdatedAt: 0,
    retry: false,
  });

  return (
    <div className="flex min-h-screen bg-[#1f2937] font-sans text-[#c7d2fe]">
      {editMode && <SettingsDrawer />}
      <div className="min-w-0 flex-1 p-8">
      <main className="mx-auto max-w-6xl rounded-3xl bg-[#111827] p-16">
        <div className="mb-12 text-5xl font-bold">
          {name ? `Hello, ${name}` : <Skeleton className="h-12 w-72" />}
        </div>
        {startpage ? (
          <div className="space-y-10">
            {startpage.groups.map((group, i) => (
              <CollapsibleGroup
                key={group.id}
                group={group}
                labelled={i > 0 && !!group.name}
                first={i === 0}
                edit={
                  editMode
                    ? {
                        onSelect: (app) => setEditing({ kind: "existing", app }),
                        onAdd: () => setEditing({ kind: "new", groupId: group.id }),
                      }
                    : undefined
                }
              />
            ))}
            {editMode && (
              <button
                type="button"
                onClick={() => addGroup.mutate()}
                disabled={addGroup.isPending}
                className="text-sm text-[#6b7aa6] hover:text-white"
              >
                + Add group
              </button>
            )}
          </div>
        ) : (
          <Skeleton className="h-24 w-full" />
        )}
      </main>
      </div>
      <button
        onClick={() => {
          setEditMode((m) => !m);
          setEditing(null);
        }}
        className="fixed bottom-6 left-6 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
      >
        {editMode ? "Done" : "Edit"}
      </button>
      {editing && (
        <AppModal
          key={editing.kind === "new" ? `new-${editing.groupId}` : editing.app.id}
          title={editing.kind === "new" ? "Add app" : "Edit app"}
          initial={editing.kind === "new" ? blankDraft : editing.app}
          saving={save.isPending}
          onSave={(draft) => save.mutate({ target: editing, draft })}
          onDelete={editing.kind === "existing" ? () => remove.mutate(editing.app) : undefined}
          onCancel={() => setEditing(null)}
        />
      )}
      {undoable && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-[#1f2937] px-5 py-2 text-sm"
        >
          Deleted {undoable.name}
          <button onClick={() => undo.mutate(undoable)} disabled={undo.isPending} className="font-semibold text-white">
            Undo
          </button>
        </div>
      )}
      <button
        onClick={() => void signOut()}
        className="fixed right-6 bottom-6 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}
