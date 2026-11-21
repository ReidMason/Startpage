import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { updateGroup, type Group, type Startpage } from "@/api";
import { Grid, type GridEdit } from "@/components/Grid";
import { startpageQueryKey, writeCachedStartpage } from "@/lib/startpage";

function useToggleCollapsed() {
  const queryClient = useQueryClient();
  const setCollapsed = (id: number, collapsed: boolean) => {
    queryClient.setQueryData<Startpage>(startpageQueryKey, (old) => {
      if (!old) return old;
      const next = { groups: old.groups.map((g) => (g.id === id ? { ...g, collapsed } : g)) };
      writeCachedStartpage(next);
      return next;
    });
  };
  return useMutation({
    mutationFn: async ({ id, collapsed }: { id: number; collapsed: boolean }) => {
      const { error } = await updateGroup({ path: { id }, body: { collapsed } });
      if (error) throw new Error("update group failed");
    },
    onMutate: ({ id, collapsed }) => setCollapsed(id, collapsed),
    onError: (_err, { id, collapsed }) => setCollapsed(id, !collapsed),
  });
}

function GroupEditHeader({ group, first }: { group: Group; first: boolean }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(group.name);
  const update = useMutation({
    mutationFn: async (body: { name?: string; style?: Group["style"] }) => {
      const { error } = await updateGroup({ path: { id: group.id }, body });
      if (error) throw new Error("update group failed");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: startpageQueryKey }),
  });
  return (
    <div className="mb-4 flex items-center gap-3 text-sm">
      <input
        value={name}
        placeholder={first ? "(unlabelled)" : "Group name"}
        aria-label="Group name"
        onChange={(e) => setName(e.target.value)}
        onBlur={() => name.trim() !== group.name && update.mutate({ name })}
        className="w-48 bg-transparent tracking-wide text-[#9aa5c9] uppercase outline-none placeholder:text-[#4b5d8a]"
      />
      <button
        type="button"
        aria-label="Toggle group style"
        onClick={() => update.mutate({ style: group.style === "tiles" ? "compact" : "tiles" })}
        className="text-xs text-[#6b7aa6] hover:text-white"
      >
        {group.style}
      </button>
    </div>
  );
}

export function CollapsibleGroup({
  group,
  labelled,
  first,
  edit,
}: {
  group: Group;
  labelled: boolean;
  first: boolean;
  edit?: GridEdit;
}) {
  const toggle = useToggleCollapsed();
  return (
    <section>
      {edit && <GroupEditHeader group={group} first={first} />}
      {!edit && labelled && (
        <button
          onClick={() => toggle.mutate({ id: group.id, collapsed: !group.collapsed })}
          className="group/label mb-4 flex items-center gap-1.5 text-sm tracking-wide text-[#6b7aa6] uppercase"
        >
          {group.name}
          <Icon
            icon={group.collapsed ? "lucide:chevron-right" : "lucide:chevron-down"}
            className="opacity-0 transition-opacity group-hover/label:opacity-100"
          />
        </button>
      )}
      {(edit || !group.collapsed) && <Grid group={group} edit={edit} />}
    </section>
  );
}
