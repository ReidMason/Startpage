import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  closestCorners,
  type CollisionDetection,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";

import { EditForm, Grid, accent, app, initial, type App, type Group, type Removed } from "./Proto";

export function InlineProto() {
  const [groups, setGroups] = useState<Group[]>(initial);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<Removed | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const selectedApp = groups.flatMap((g) => g.apps).find((a) => a.id === selected) ?? null;

  const updateApp = (id: string, patch: Partial<App>) =>
    setGroups((gs) =>
      gs.map((g) => ({ ...g, apps: g.apps.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
    );

  const addApp = (groupId: string) => {
    const id = `n${Date.now()}`;
    setGroups((gs) =>
      gs.map((g) =>
        g.id === groupId ? { ...g, apps: [...g.apps, app(id, "New app", "example.com", "mdi:link-variant")] } : g,
      ),
    );
    setSelected(id);
  };

  const deleteApp = (id: string) => {
    const gi = groups.findIndex((g) => g.apps.some((a) => a.id === id));
    const index = groups[gi].apps.findIndex((a) => a.id === id);
    const a = groups[gi].apps[index];
    setGroups((gs) => gs.map((g) => ({ ...g, apps: g.apps.filter((x) => x.id !== id) })));
    setSelected(null);
    setRemoved({ app: a, groupId: groups[gi].id, index });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setRemoved(null), 6000);
  };

  const undo = () => {
    if (!removed) return;
    setGroups((gs) =>
      gs.map((g) => {
        if (g.id !== removed.groupId) return g;
        const apps = [...g.apps];
        apps.splice(removed.index, 0, removed.app);
        return { ...g, apps };
      }),
    );
    setRemoved(null);
  };

  const patchGroup = (id: string, patch: Partial<Group>) =>
    setGroups((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const toggleCollapsed = (id: string) =>
    setCollapsed((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="flex min-h-screen bg-[#1f2937] font-sans text-[#c7d2fe]">
      {editMode && <SettingsDrawer />}
      <div className="min-w-0 flex-1 p-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#111827] p-16">
          <div className="border-b-2 border-[#4b5d8a] pb-3 text-4xl text-[#9aa5c9]">Search...</div>
          <div className="mt-10 mb-12">
            <div className="text-xl font-semibold">Friday, 20th November 2026</div>
            <div className="text-6xl font-bold">Good Evening</div>
          </div>

          {editMode ? (
            <EditableGroups
              groups={groups}
              setGroups={setGroups}
              patchGroup={patchGroup}
              onSelect={setSelected}
              onAddApp={addApp}
              onAddGroup={() =>
                setGroups((gs) => [...gs, { id: `g${Date.now()}`, name: "New group", style: "tiles", apps: [] }])
              }
            />
          ) : (
            <div className="space-y-10">
              {groups.map((g, i) => (
                <section key={g.id}>
                  {(i > 0 || g.name) && (
                    <button
                      onClick={() => toggleCollapsed(g.id)}
                      className="group/label mb-4 flex items-center gap-1.5 text-sm tracking-wide text-[#6b7aa6] uppercase"
                    >
                      {g.name}
                      <Icon
                        icon={collapsed.has(g.id) ? "lucide:chevron-right" : "lucide:chevron-down"}
                        className="opacity-0 transition-opacity group-hover/label:opacity-100"
                      />
                    </button>
                  )}
                  {!collapsed.has(g.id) && <Grid group={g} />}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          setEditMode((m) => !m);
          setSelected(null);
        }}
        className="fixed bottom-6 left-6 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
      >
        {editMode ? "Done" : "Edit"}
      </button>

      {selectedApp && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50" onClick={() => setSelected(null)}>
          <div
            className="h-[34rem] w-[28rem] rounded-xl bg-[#0b1020] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <EditForm app={selectedApp} update={updateApp} remove={deleteApp} back={() => setSelected(null)} />
          </div>
        </div>
      )}

      {removed && (
        <div className="fixed right-6 bottom-6 z-20 flex items-center gap-4 rounded-lg bg-[#1f2937] px-4 py-3 text-sm shadow-lg">
          Deleted {removed.app.name}
          <button onClick={undo} className="font-semibold text-white underline">
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

function SettingsDrawer() {
  const field = "w-full rounded bg-[#111827] px-3 py-2 outline-none focus:ring-1 focus:ring-[#4b5d8a]";
  return (
    <aside className="sticky top-0 h-screen w-80 shrink-0 space-y-6 overflow-y-auto bg-[#0b1020] p-6 pb-20">
      <h2 className="text-lg font-semibold">Settings</h2>
      <section className="space-y-3">
        <h3 className="text-xs tracking-wide text-[#6b7aa6] uppercase">Weather</h3>
        <label className="block text-sm">
          API key
          <input className={field} placeholder="••••••••" />
        </label>
        <label className="block text-sm">
          Location
          <input className={field} defaultValue="London" />
        </label>
        <label className="block text-sm">
          Units
          <select className={field} defaultValue="c">
            <option value="c">Celsius</option>
            <option value="f">Fahrenheit</option>
          </select>
        </label>
      </section>
      <section className="space-y-3">
        <h3 className="text-xs tracking-wide text-[#6b7aa6] uppercase">Appearance</h3>
        <label className="block text-sm">
          Theme
          <select className={field} defaultValue="dark">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" /> Capitalise names
        </label>
      </section>
    </aside>
  );
}

type EditableProps = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  patchGroup: (id: string, patch: Partial<Group>) => void;
  onSelect: (id: string) => void;
  onAddApp: (groupId: string) => void;
  onAddGroup: () => void;
};

function EditableGroups({ groups, setGroups, patchGroup, onSelect, onAddApp, onAddGroup }: EditableProps) {
  const [active, setActive] = useState<App | null>(null);
  const dragged = useRef(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const groupOf = (id: string) => groups.find((g) => g.id === id || g.apps.some((a) => a.id === id));

  const collision: CollisionDetection = (args) =>
    String(args.active.id).startsWith(GROUP_PREFIX)
      ? closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((c) => String(c.id).startsWith(GROUP_PREFIX)),
        })
      : closestCorners(args);

  const onStart = (e: DragStartEvent) => {
    dragged.current = true;
    if (String(e.active.id).startsWith(GROUP_PREFIX)) return;
    setActive(groups.flatMap((g) => g.apps).find((a) => a.id === e.active.id) ?? null);
  };

  const onOver = ({ active, over }: DragOverEvent) => {
    if (!over || String(active.id).startsWith(GROUP_PREFIX)) return;
    const from = groupOf(String(active.id));
    const to = groupOf(String(over.id));
    if (!from || !to || from.id === to.id) return;
    setGroups((gs) => {
      const moving = from.apps.find((a) => a.id === active.id)!;
      const overIndex = to.apps.findIndex((a) => a.id === over.id);
      return gs.map((g) => {
        if (g.id === from.id) return { ...g, apps: g.apps.filter((a) => a.id !== active.id) };
        if (g.id === to.id) {
          const apps = [...g.apps];
          apps.splice(overIndex >= 0 ? overIndex : apps.length, 0, moving);
          return { ...g, apps };
        }
        return g;
      });
    });
  };

  const onEnd = ({ active, over }: DragEndEvent) => {
    setActive(null);
    window.setTimeout(() => (dragged.current = false), 0);
    if (!over) return;
    if (String(active.id).startsWith(GROUP_PREFIX)) {
      const oldI = groups.findIndex((g) => GROUP_PREFIX + g.id === active.id);
      const newI = groups.findIndex((g) => GROUP_PREFIX + g.id === over.id);
      if (newI >= 0 && oldI !== newI) setGroups((gs) => arrayMove(gs, oldI, newI));
      return;
    }
    const g = groupOf(String(active.id));
    if (!g) return;
    const oldI = g.apps.findIndex((a) => a.id === active.id);
    const newI = g.apps.findIndex((a) => a.id === over.id);
    if (newI >= 0 && oldI !== newI)
      setGroups((gs) => gs.map((x) => (x.id === g.id ? { ...x, apps: arrayMove(x.apps, oldI, newI) } : x)));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={collision} onDragStart={onStart} onDragOver={onOver} onDragEnd={onEnd}>
      <SortableContext items={groups.map((g) => GROUP_PREFIX + g.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-10">
        {groups.map((g, i) => (
          <SortableGroup key={g.id} id={GROUP_PREFIX + g.id}>
            {(handle) => (
          <>
            <div className="mb-4 flex items-center gap-3 text-sm">
              {handle}
              <input
                value={g.name}
                placeholder={i === 0 ? "(unlabelled)" : "Group name"}
                onChange={(e) => patchGroup(g.id, { name: e.target.value })}
                className="w-48 bg-transparent tracking-wide text-[#9aa5c9] uppercase outline-none placeholder:text-[#4b5d8a]"
              />
              <button
                onClick={() => patchGroup(g.id, { style: g.style === "tiles" ? "compact" : "tiles" })}
                className="text-xs text-[#6b7aa6] hover:text-white"
              >
                {g.style}
              </button>
            </div>
            <DropGroup group={g} onSelect={(id) => !dragged.current && onSelect(id)} onAdd={() => onAddApp(g.id)} />
          </>
            )}
          </SortableGroup>
        ))}
        <button onClick={onAddGroup} className="text-sm text-[#6b7aa6] hover:text-white">
          + Add group
        </button>
      </div>
      </SortableContext>
      <DragOverlay>{active && <Tile app={active} />}</DragOverlay>
    </DndContext>
  );
}

const GROUP_PREFIX = "group:";

function SortableGroup({ id, children }: { id: string; children: (handle: React.ReactNode) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const handle = (
    <button
      {...attributes}
      {...listeners}
      aria-label="Drag group"
      className="cursor-grab text-[#6b7aa6] hover:text-white"
    >
      <Icon icon="lucide:grip-vertical" />
    </button>
  );
  return (
    <section
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      {children(handle)}
    </section>
  );
}

function DropGroup({ group, onSelect, onAdd }: { group: Group; onSelect: (id: string) => void; onAdd: () => void }) {
  const { setNodeRef } = useDroppable({ id: group.id });
  return (
    <SortableContext items={group.apps.map((a) => a.id)} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} className="grid min-h-16 grid-cols-3 gap-x-6 gap-y-4 rounded-lg border border-dashed border-[#2a3550] p-3 2xl:grid-cols-4">
        {group.apps.map((a) => (
          <SortableTile key={a.id} app={a} onSelect={onSelect} />
        ))}
        <button
          onClick={onAdd}
          className="flex items-center gap-3 rounded-lg px-2 py-1 text-[#6b7aa6] hover:text-white"
        >
          <Icon icon="lucide:plus" className="size-8" /> Add app
        </button>
      </div>
    </SortableContext>
  );
}

function SortableTile({ app, onSelect }: { app: App; onSelect: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(app.id)}
    >
      <Tile app={app} />
    </div>
  );
}

function Tile({ app }: { app: App }) {
  return (
    <div className="flex cursor-grab items-center gap-3 rounded-lg px-2 py-1 hover:bg-[#1a2236]">
      <Icon icon={app.icon} className={`size-10 shrink-0 ${accent}`} />
      <span className="min-w-0">
        <span className={`block truncate text-xl ${accent}`}>{app.name}</span>
        <span className="block truncate text-sm text-[#9aa5c9]">{app.url}</span>
      </span>
    </div>
  );
}
