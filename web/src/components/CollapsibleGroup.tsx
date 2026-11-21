import { Icon } from "@iconify/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { updateGroup, type Group } from "@/api";
import { Grid, type GridEdit } from "@/components/Grid";
import { groupSortId } from "@/components/ReorderContext";
import { optimisticStartpage, rollbackStartpage, startpageQueryKey } from "@/lib/startpage";

function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: number; name?: string; style?: Group["style"]; collapsed?: boolean }) => {
      const { error } = await updateGroup({ path: { id }, body });
      if (error) throw new Error("update group failed");
    },
    onMutate: ({ id, ...fields }) =>
      optimisticStartpage(queryClient, (page) => ({
        groups: page.groups.map((g) => (g.id === id ? { ...g, ...fields } : g)),
      })),
    onError: (_err, _vars, context) => rollbackStartpage(queryClient, context),
    onSettled: () => queryClient.invalidateQueries({ queryKey: startpageQueryKey }),
  });
}

function GroupEditHeader({ group, first, handle }: { group: Group; first: boolean; handle: ReactNode }) {
  const [name, setName] = useState(group.name);
  const update = useUpdateGroup();
  useEffect(() => setName(group.name), [group.name]);
  const commitName = () => {
    const trimmed = name.trim();
    if (trimmed === group.name) return;
    if (trimmed === "") setName(group.name);
    else update.mutate({ id: group.id, name: trimmed });
  };
  return (
    <div className="mb-4 flex items-center gap-3 text-sm">
      {handle}
      <input
        value={name}
        placeholder={first ? "(unlabelled)" : "Group name"}
        aria-label="Group name"
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        className="w-48 bg-transparent tracking-wide text-[#9aa5c9] uppercase outline-none placeholder:text-[#4b5d8a]"
      />
      <button
        type="button"
        aria-label="Toggle group style"
        onClick={() => update.mutate({ id: group.id, style: group.style === "tiles" ? "compact" : "tiles" })}
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
  const toggle = useUpdateGroup();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: groupSortId(group.id),
    disabled: !edit,
  });
  const handle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label="Drag group"
      className="cursor-grab touch-none text-[#6b7aa6] hover:text-white"
    >
      <Icon icon="lucide:grip-vertical" />
    </button>
  );
  return (
    <section
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      {edit && <GroupEditHeader group={group} first={first} handle={handle} />}
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
      {(edit || !group.collapsed || !labelled) && <Grid group={group} edit={edit} />}
    </section>
  );
}
