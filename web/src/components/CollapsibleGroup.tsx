import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateGroup, type Group, type Startpage } from "@/api";
import { Grid } from "@/components/Grid";
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

export function CollapsibleGroup({ group, labelled }: { group: Group; labelled: boolean }) {
  const toggle = useToggleCollapsed();
  return (
    <section>
      {labelled && (
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
      {!group.collapsed && <Grid group={group} />}
    </section>
  );
}
