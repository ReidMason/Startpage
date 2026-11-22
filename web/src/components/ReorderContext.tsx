import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useRef, type ComponentProps, type ReactNode } from "react";

import { arrangeStartpage, type Startpage } from "@/api";
import { setStartpage, startpageQueryKey, updateStartpage } from "@/lib/startpage";

type Events = ComponentProps<typeof DragDropProvider>;
type DragOverEvent = Parameters<NonNullable<Events["onDragOver"]>>[0];
type DragEndEvent = Parameters<NonNullable<Events["onDragEnd"]>>[0];

export const groupDropId = (groupId: number) => `group:${groupId}`;

export const groupSortId = (groupId: number) => `groupsort:${groupId}`;

const DragGuardContext = createContext<() => boolean>(() => false);

export function useJustDragged() {
  return useContext(DragGuardContext);
}

function useArrange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (page: Startpage) => {
      const { error } = await arrangeStartpage({
        body: { groups: page.groups.map((g) => ({ id: g.id, appIds: g.apps.map((a) => a.id) })) },
      });
      if (error) throw new Error("arranging startpage failed");
    },
    onError: () => queryClient.invalidateQueries({ queryKey: startpageQueryKey }),
  });
}

export function ReorderContext({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const arrange = useArrange();
  const dragged = useRef(false);
  const dragStart = useRef<Startpage | undefined>(undefined);

  const page = () => queryClient.getQueryData<Startpage>(startpageQueryKey);

  const onStart = () => {
    dragged.current = true;
    dragStart.current = page();
  };

  const onOver = (event: DragOverEvent) => {
    if (event.operation.source?.type === "group") return;
    updateStartpage(queryClient, (old) => {
      const apps = new Map(old.groups.flatMap((g) => g.apps.map((a) => [a.id, a] as const)));
      const layout = Object.fromEntries(old.groups.map((g) => [groupDropId(g.id), g.apps.map((a) => a.id)]));
      const next = move(layout, event);
      if (next === layout) return old;
      return { ...old, groups: old.groups.map((g) => ({ ...g, apps: next[groupDropId(g.id)].map((id) => apps.get(id)!) })) };
    });
  };

  const onEnd = (event: DragEndEvent) => {
    window.setTimeout(() => (dragged.current = false), 0);
    if (event.canceled) {
      if (dragStart.current) setStartpage(queryClient, dragStart.current);
      return;
    }
    if (event.operation.source?.type === "group") {
      updateStartpage(queryClient, (old) => {
        const order = move(old.groups.map((g) => groupSortId(g.id)), event);
        return { ...old, groups: order.map((id) => old.groups.find((g) => groupSortId(g.id) === id)!) };
      });
    }
    const next = page();
    if (next) arrange.mutate(next);
  };

  return (
    <DragGuardContext.Provider value={() => dragged.current}>
      <DragDropProvider onDragStart={onStart} onDragOver={onOver} onDragEnd={onEnd}>
        {children}
      </DragDropProvider>
    </DragGuardContext.Provider>
  );
}
