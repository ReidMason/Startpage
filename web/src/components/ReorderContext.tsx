import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";

import { arrangeStartpage, type App, type Group, type Startpage } from "@/api";
import { AppTile } from "@/components/Grid";
import { setStartpage, startpageQueryKey, updateStartpage } from "@/lib/startpage";

export const groupDropId = (groupId: number) => `group:${groupId}`;

export const groupSortId = (groupId: number) => `groupsort:${groupId}`;

const isGroupSort = (id: string | number) => typeof id === "string" && id.startsWith("groupsort:");

const collision: CollisionDetection = (args) => {
  const containers = args.droppableContainers;
  if (isGroupSort(args.active.id)) return closestCenter({ ...args, droppableContainers: containers.filter((c) => isGroupSort(c.id)) });
  return closestCorners({ ...args, droppableContainers: containers.filter((c) => !isGroupSort(c.id)) });
};

const DragGuardContext = createContext<() => boolean>(() => false);

export function useJustDragged() {
  return useContext(DragGuardContext);
}

function findGroupIndex(page: Startpage, id: string | number) {
  if (typeof id === "string" && id.startsWith("group:")) return page.groups.findIndex((g) => groupDropId(g.id) === id);
  return page.groups.findIndex((g) => g.apps.some((a) => a.id === id));
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
  const [active, setActive] = useState<{ app: App; style: Group["style"] } | null>(null);
  const dragged = useRef(false);
  const dragStart = useRef<Startpage | undefined>(undefined);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const page = () => queryClient.getQueryData<Startpage>(startpageQueryKey);
  const update = (change: (p: Startpage) => Startpage) => {
    updateStartpage(queryClient, change);
  };
  const endDrag = () => {
    setActive(null);
    window.setTimeout(() => (dragged.current = false), 0);
  };

  const onStart = (e: DragStartEvent) => {
    dragged.current = true;
    dragStart.current = page();
    if (isGroupSort(e.active.id)) return;
    const p = page();
    const group = p?.groups.find((g) => g.apps.some((a) => a.id === e.active.id));
    const app = group?.apps.find((a) => a.id === e.active.id);
    setActive(group && app ? { app, style: group.style } : null);
  };

  const onOver = ({ active, over }: DragOverEvent) => {
    const p = page();
    if (!p || !over || isGroupSort(active.id)) return;
    const from = findGroupIndex(p, active.id);
    const to = findGroupIndex(p, over.id);
    if (from < 0 || to < 0 || from === to) return;
    update((old) => {
      const moving = old.groups[from].apps.find((a) => a.id === active.id)!;
      const overIndex = old.groups[to].apps.findIndex((a) => a.id === over.id);
      return {
        ...old,
        groups: old.groups.map((g, i) => {
          if (i === from) return { ...g, apps: g.apps.filter((a) => a.id !== active.id) };
          if (i !== to) return g;
          const apps = [...g.apps];
          apps.splice(overIndex >= 0 ? overIndex : apps.length, 0, moving);
          return { ...g, apps };
        }),
      };
    });
  };

  const onCancel = () => {
    endDrag();
    if (dragStart.current) setStartpage(queryClient, dragStart.current);
  };

  const onEnd = ({ active, over }: DragEndEvent) => {
    endDrag();
    const p = page();
    if (!p || !over) {
      if (p) void queryClient.invalidateQueries({ queryKey: startpageQueryKey });
      return;
    }
    if (isGroupSort(active.id)) {
      const oldI = p.groups.findIndex((g) => groupSortId(g.id) === active.id);
      const newI = p.groups.findIndex((g) => groupSortId(g.id) === over.id);
      if (newI >= 0 && oldI !== newI) update((old) => ({ ...old, groups: arrayMove(old.groups, oldI, newI) }));
    }
    const gi = isGroupSort(active.id) ? -1 : findGroupIndex(p, active.id);
    if (gi >= 0) {
      const apps = p.groups[gi].apps;
      const oldI = apps.findIndex((a) => a.id === active.id);
      const newI = apps.findIndex((a) => a.id === over.id);
      if (newI >= 0 && oldI !== newI) update((old) => ({ ...old, groups: old.groups.map((g, i) => (i === gi ? { ...g, apps: arrayMove(g.apps, oldI, newI) } : g)) }));
    }
    const next = page();
    if (next) arrange.mutate(next);
  };

  return (
    <DragGuardContext.Provider value={() => dragged.current}>
      <DndContext sensors={sensors} collisionDetection={collision} onDragStart={onStart} onDragOver={onOver} onDragEnd={onEnd} onDragCancel={onCancel}>
        {children}
        <DragOverlay>{active && <AppTile app={active.app} style={active.style} />}</DragOverlay>
      </DndContext>
    </DragGuardContext.Provider>
  );
}
