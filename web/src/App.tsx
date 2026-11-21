import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import {
  createApp,
  createGroup,
  deleteApp,
  restoreApp,
  updateApp,
  updateSettings,
  type App as AppModel,
  type Settings,
  type SettingsUpdate,
  type Startpage,
} from "@/api";
import { AppModal, type AppDraft } from "@/components/AppModal";
import { CollapsibleGroup } from "@/components/CollapsibleGroup";
import { groupSortId, ReorderContext } from "@/components/ReorderContext";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { UnsavedChangesPrompt } from "@/components/UnsavedChangesPrompt";
import { Skeleton } from "@/components/ui/skeleton";
import { Welcome } from "@/components/Welcome";
import { signOut } from "@/lib/session";
import { changedSettings, defaultSearchEngine, isDirty, isValidSearchEngine } from "@/lib/settings";
import {
  fetchStartpage,
  optimisticStartpage,
  readCachedStartpage,
  rollbackStartpage,
  setStartpage,
  startpageQueryKey,
} from "@/lib/startpage";

type Editing = { kind: "new"; groupId: number } | { kind: "existing"; app: AppModel };

type Deleted = { app: AppModel; groupId: number; index: number };

const blankDraft: AppDraft = { name: "", url: "", iconName: "", iconSvg: "" };

const draftOf = ({ name, url, iconName, iconSvg }: AppModel): AppDraft => ({ name, url, iconName, iconSvg });

export function App() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: startpageQueryKey });
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
    onMutate: ({ target, draft }) =>
      target.kind === "existing"
        ? optimisticStartpage(queryClient, (page) => ({
            ...page,
            groups: page.groups.map((g) => ({
              ...g,
              apps: g.apps.map((a) => (a.id === target.app.id ? { ...a, ...draft } : a)),
            })),
          }))
        : undefined,
    onError: (_err, _vars, context) => rollbackStartpage(queryClient, context),
    onSuccess: () => setEditing(null),
    onSettled: refresh,
  });
  const [undoable, setUndoable] = useState<Deleted | null>(null);
  useEffect(() => {
    if (!undoable) return;
    const t = setTimeout(() => setUndoable(null), 6000);
    return () => clearTimeout(t);
  }, [undoable]);
  const remove = useMutation({
    mutationFn: async (app: AppModel) => {
      const res = await deleteApp({ path: { id: app.id } });
      if (res.error) throw new Error(`deleting app failed: ${res.response?.status}`);
    },
    onMutate: async (app) => {
      const context = await optimisticStartpage(queryClient, (page) => ({
        ...page,
        groups: page.groups.map((g) => ({ ...g, apps: g.apps.filter((a) => a.id !== app.id) })),
      }));
      const group = context.previous?.groups.find((g) => g.apps.some((a) => a.id === app.id));
      setEditing(null);
      if (group) setUndoable({ app, groupId: group.id, index: group.apps.findIndex((a) => a.id === app.id) });
      return context;
    },
    onError: (_err, _app, context) => {
      rollbackStartpage(queryClient, context);
      setUndoable(null);
    },
    onSettled: refresh,
  });
  const undo = useMutation({
    mutationFn: async ({ app }: Deleted) => {
      const res = await restoreApp({ path: { id: app.id } });
      if (res.error) throw new Error(`restoring app failed: ${res.response?.status}`);
    },
    onMutate: ({ app, groupId, index }) => {
      setUndoable(null);
      return optimisticStartpage(queryClient, (page) => ({
        ...page,
        groups: page.groups.map((g) => {
          if (g.id !== groupId) return g;
          const apps = [...g.apps];
          apps.splice(Math.min(index, apps.length), 0, app);
          return { ...g, apps };
        }),
      }));
    },
    onError: (_err, _vars, context) => rollbackStartpage(queryClient, context),
    onSettled: refresh,
  });
  const addGroup = useMutation({
    mutationFn: async () => {
      const res = await createGroup({ body: { name: "New group" } });
      if (res.error) throw new Error(`creating group failed: ${res.response?.status}`);
    },
    onSuccess: refresh,
  });
  const { data: startpage } = useQuery({
    queryKey: startpageQueryKey,
    queryFn: fetchStartpage,
    initialData: readCachedStartpage,
    initialDataUpdatedAt: 0,
    retry: false,
  });
  const [settingsDraft, setSettingsDraft] = useState<Settings | null>(null);
  const saved = startpage?.settings;
  const draft = settingsDraft ?? saved;
  const dirty = !!saved && !!draft && isDirty(saved, draft);
  const [confirmingDone, setConfirmingDone] = useState(false);
  const discardDraft = () => {
    saveSettings.reset();
    setSettingsDraft(null);
  };
  const exitEditMode = () => {
    setConfirmingDone(false);
    setEditMode(false);
    setEditing(null);
  };
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const saveSettings = useMutation({
    mutationFn: async ({ changes }: { changes: SettingsUpdate; next: Settings; exit?: boolean }) => {
      const res = await updateSettings({ body: changes });
      if (res.error) throw new Error(`saving settings failed: ${res.response?.status}`);
    },
    onSuccess: (_data, { next, exit }) => {
      if (exit) exitEditMode();
      const page = queryClient.getQueryData<Startpage>(startpageQueryKey);
      if (page) setStartpage(queryClient, { ...page, settings: next });
      setSettingsDraft(null);
      refresh();
    },
  });
  const pageSettings = editMode ? draft : saved;

  return (
    <div className="flex min-h-screen bg-[#1f2937] font-sans text-[#c7d2fe]">
      {editMode && (
        <SettingsDrawer
          draft={draft}
          dirty={dirty}
          saving={saveSettings.isPending}
          error={saveSettings.isError}
          onChange={(next) => {
            saveSettings.reset();
            setSettingsDraft(next);
          }}
          onSave={() => {
            if (saved && draft) saveSettings.mutate({ changes: changedSettings(saved, draft), next: draft });
          }}
          onDiscard={discardDraft}
        />
      )}
      <div className="min-w-0 flex-1 p-8">
        <main className="mx-auto max-w-6xl rounded-3xl bg-[#111827] p-16">
          <Welcome
            editMode={editMode}
            searchEngine={pageSettings?.searchEngine ?? defaultSearchEngine}
            showName={pageSettings?.showNameInGreeting ?? false}
          />
          {startpage ? (
            <ReorderContext>
              <SortableContext items={startpage.groups.map((g) => groupSortId(g.id))} strategy={verticalListSortingStrategy}>
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
              </SortableContext>
            </ReorderContext>
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
        </main>
      </div>
      <button
        onClick={() => {
          if (!editMode) setEditMode(true);
          else if (dirty) setConfirmingDone(true);
          else exitEditMode();
        }}
        className="fixed bottom-6 left-6 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
      >
        {editMode ? "Done" : "Edit"}
      </button>
      {confirmingDone && saved && draft && (
        <UnsavedChangesPrompt
          saving={saveSettings.isPending}
          canSave={isValidSearchEngine(draft.searchEngine)}
          onSave={() => saveSettings.mutate({ changes: changedSettings(saved, draft), next: draft, exit: true })}
          error={saveSettings.isError}
          onDiscard={() => {
            discardDraft();
            exitEditMode();
          }}
          onKeepEditing={() => setConfirmingDone(false)}
        />
      )}
      {editing && (
        <AppModal
          key={editing.kind === "new" ? `new-${editing.groupId}` : editing.app.id}
          title={editing.kind === "new" ? "Add app" : "Edit app"}
          initial={editing.kind === "new" ? blankDraft : draftOf(editing.app)}
          saving={save.isPending}
          error={save.isError && save.variables?.target === editing ? "Could not save. Try again." : undefined}
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
          Deleted {undoable.app.name}
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
