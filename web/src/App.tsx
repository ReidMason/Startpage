import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import {
  createApp,
  createGroup,
  deleteApp,
  listThemes,
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
import { Grid } from "@/components/Grid";
import { ReorderContext } from "@/components/ReorderContext";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Welcome } from "@/components/Welcome";
import { filterApps, isFilterQuery } from "@/lib/filter";
import { signOut } from "@/lib/session";
import { applyTheme, cacheTheme, resolveTheme, usePrefersDark } from "@/lib/theme";
import { changedSettings, defaultSearchEngine, defaultSearchPlaceholder, isDirty, isValidSearchEngine } from "@/lib/settings";
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

function FilterResults({ apps, highlightFirst, onEscape }: { apps: AppModel[]; highlightFirst: boolean; onEscape: () => void }) {
  if (apps.length === 0) return <p className="text-lg text-muted-foreground">No matching apps</p>;
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Escape") onEscape();
      }}
    >
      <Grid group={{ id: 0, name: "", style: "tiles", collapsed: false, apps }} highlightFirst={highlightFirst} />
    </div>
  );
}

export function App() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: startpageQueryKey });
  const [editMode, setEditMode] = useState(false);
  const [query, setQuery] = useState("");
  const filtering = !editMode && isFilterQuery(query);
  const searchInput = useRef<HTMLInputElement>(null);
  const [barFocused, setBarFocused] = useState(false);
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
  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data } = await listThemes();
      return data ?? [];
    },
    staleTime: Infinity,
  });
  const prefersDark = usePrefersDark();
  const [settingsDraft, setSettingsDraft] = useState<Settings | null>(null);
  const saved = startpage?.settings;
  const draft = settingsDraft ?? saved;
  const shownThemeId = ((editMode ? draft : saved)?.themeId ?? null) as number | null;
  useEffect(() => {
    if (!themes || !startpage) return;
    applyTheme(document.documentElement, resolveTheme(themes, shownThemeId, prefersDark));
  }, [themes, startpage, shownThemeId, prefersDark]);
  const savedThemeId = (saved?.themeId ?? null) as number | null;
  useEffect(() => {
    if (!themes || !startpage) return;
    cacheTheme(localStorage, resolveTheme(themes, savedThemeId, prefersDark));
  }, [themes, startpage, savedThemeId, prefersDark]);
  const dirty = !!saved && !!draft && isDirty(saved, draft);
  const discardDraft = () => {
    saveSettings.reset();
    setSettingsDraft(null);
  };
  const exitEditMode = () => {
    saveSettings.reset();
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
    mutationFn: async ({ changes }: { changes: SettingsUpdate; next: Settings }) => {
      const res = await updateSettings({ body: changes });
      if (res.error) throw new Error(`saving settings failed: ${res.response?.status}`);
    },
    onSuccess: (_data, { next }) => {
      const page = queryClient.getQueryData<Startpage>(startpageQueryKey);
      if (page) setStartpage(queryClient, { ...page, settings: next });
      setSettingsDraft(null);
      refresh();
    },
  });
  const pageSettings = editMode ? draft : saved;
  const filterResults = startpage && filtering ? filterApps(startpage.groups.flatMap((g) => g.apps), query) : [];
  const clearQueryAndFocus = () => {
    setQuery("");
    searchInput.current?.focus();
  };

  return (
    <div className="flex min-h-screen bg-secondary font-sans text-foreground">
      {editMode && (
        <SettingsDrawer
          draft={draft}
          themes={themes ?? []}
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
          onClose={exitEditMode}
        />
      )}
      <div className="min-w-0 flex-1 px-8 py-[5%]">
        <main className="mx-auto flex max-w-screen-2xl flex-col gap-8 rounded-2xl bg-card p-8 sm:p-16">
          <Welcome
            editMode={editMode}
            searchEngine={pageSettings?.searchEngine ?? defaultSearchEngine}
            searchPlaceholder={pageSettings?.searchPlaceholder ?? defaultSearchPlaceholder}
            showName={pageSettings?.showNameInGreeting ?? false}
            query={query}
            onQueryChange={setQuery}
            onEscape={clearQueryAndFocus}
            bestMatch={filtering ? filterResults[0] : undefined}
            inputRef={searchInput}
            onFocusChange={setBarFocused}
          />
          {startpage && filtering && (
            <FilterResults
              apps={filterResults}
              highlightFirst={barFocused}
              onEscape={clearQueryAndFocus}
            />
          )}
          {startpage && !filtering && (
            <ReorderContext>
                <div className="space-y-10">
                  {startpage.groups.map((group, i) => (
                    <CollapsibleGroup
                      key={group.id}
                      group={group}
                      labelled={i > 0 && !!group.name}
                      first={i === 0}
                      index={i}
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
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      + Add group
                    </button>
                  )}
                </div>
            </ReorderContext>
          )}
          {!startpage && <Skeleton className="h-24 w-full" />}
        </main>
      </div>
      {!editMode && (
        <button
          onClick={() => {
            setQuery("");
            setEditMode(true);
          }}
          className="fixed bottom-6 left-6 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Edit
        </button>
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
          className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-secondary px-5 py-2 text-sm"
        >
          Deleted {undoable.app.name}
          <button onClick={() => undo.mutate(undoable)} disabled={undo.isPending} className="font-semibold text-foreground">
            Undo
          </button>
        </div>
      )}
      <button
        onClick={() => void signOut()}
        className="fixed right-6 bottom-6 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
}
