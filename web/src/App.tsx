import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { createApp, updateApp, type App as AppModel } from "@/api";
import { AppModal, type AppDraft } from "@/components/AppModal";

import { CollapsibleGroup } from "@/components/CollapsibleGroup";
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
    <div className="min-h-screen bg-[#1f2937] p-8 font-sans text-[#c7d2fe]">
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
          </div>
        ) : (
          <Skeleton className="h-24 w-full" />
        )}
      </main>
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
          onCancel={() => setEditing(null)}
        />
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
