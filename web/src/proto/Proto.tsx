import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export type App = { id: string; name: string; url: string; icon: string };
export type Group = { id: string; name: string; style: "tiles" | "compact"; apps: App[] };
export type Removed = { app: App; groupId: string; index: number };

export const app = (id: string, name: string, url: string, icon: string): App => ({ id, name, url, icon });

export const initial: Group[] = [
  {
    id: "g1",
    name: "",
    style: "tiles",
    apps: [
      app("a1", "Plex", "plex.griszle.com", "mdi:plex"),
      app("a2", "YouTube", "youtube.com", "mdi:youtube"),
      app("a3", "Youtube Music", "music.youtube.com", "mdi:youtube-music"),
      app("a4", "Chess", "lichess.org", "mdi:chess-king"),
      app("a5", "Cardmarket", "cardmarket.com", "mdi:cards"),
      app("a6", "Game Workshop", "games-workshop.com", "mdi:cash-multiple"),
      app("a7", "Firestorm Games", "firestormgames.co.uk", "mdi:fire"),
      app("a8", "Foundry", "foundry.griszle.com", "mdi:dice-d20-outline"),
    ],
  },
  {
    id: "g2",
    name: "Homelab",
    style: "tiles",
    apps: [
      app("b1", "Server", "server.griszle.com", "mdi:server"),
      app("b2", "Qbittorrent", "qbit.griszle.com", "mdi:cloud-download"),
      app("b3", "Radarr", "radarr.griszle.com", "mdi:movie-open"),
      app("b4", "Sonarr", "sonarr.griszle.com", "mdi:television-classic"),
      app("b5", "Jackett", "jackett.griszle.com", "mdi:tshirt-crew-outline"),
      app("b6", "Pi Hole", "192.168.0.42", "simple-icons:pihole"),
      app("b7", "Recipes", "recipes.griszle.com", "mdi:chef-hat"),
      app("b8", "Jenkins", "jenkins.griszle.com", "simple-icons:jenkins"),
    ],
  },
];

export const accent = "text-[#b9c9f5]";

export function Proto() {
  const [groups, setGroups] = useState<Group[]>(initial);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<Removed | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const findApp = (id: string) => groups.flatMap((g) => g.apps).find((a) => a.id === id);

  const updateApp = (id: string, patch: Partial<App>) =>
    setGroups((gs) =>
      gs.map((g) => ({ ...g, apps: g.apps.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
    );

  const addApp = () => {
    const id = `n${Date.now()}`;
    setGroups((gs) =>
      gs.map((g, i) =>
        i === 0 ? { ...g, apps: [...g.apps, app(id, "New app", "example.com", "mdi:link-variant")] } : g,
      ),
    );
    setEditing(id);
  };

  const addGroup = () =>
    setGroups((gs) => [...gs, { id: `g${Date.now()}`, name: "New group", style: "tiles", apps: [] }]);

  const deleteApp = (id: string) => {
    const gi = groups.findIndex((g) => g.apps.some((a) => a.id === id));
    const index = groups[gi].apps.findIndex((a) => a.id === id);
    const a = groups[gi].apps[index];
    setGroups((gs) => gs.map((g) => ({ ...g, apps: g.apps.filter((x) => x.id !== id) })));
    setEditing(null);
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

  const toggleCollapsed = (id: string) =>
    setCollapsed((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="min-h-screen bg-[#1f2937] p-8 font-sans text-[#c7d2fe]">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#111827] p-16">
        <div className="border-b-2 border-[#4b5d8a] pb-3 text-4xl text-[#9aa5c9]">Search...</div>
        <div className="mt-10 mb-12">
          <div className="text-xl font-semibold">Friday, 20th November 2026</div>
          <div className="text-6xl font-bold">Good Evening</div>
        </div>

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
      </div>

      <button
        onClick={() => setDrawer(true)}
        className="fixed bottom-6 left-6 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
      >
        Edit
      </button>

      {drawer && (
        <Drawer
          groups={groups}
          setGroups={setGroups}
          editing={editing ? (findApp(editing) ?? null) : null}
          setEditing={setEditing}
          updateApp={updateApp}
          deleteApp={deleteApp}
          addApp={addApp}
          addGroup={addGroup}
          onClose={() => {
            setDrawer(false);
            setEditing(null);
          }}
        />
      )}

      {removed && (
        <div className="fixed right-6 bottom-6 flex items-center gap-4 rounded-lg bg-[#1f2937] px-4 py-3 text-sm shadow-lg">
          Deleted {removed.app.name}
          <button onClick={undo} className="font-semibold text-white underline">
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export function Grid({ group }: { group: Group }) {
  if (group.style === "compact")
    return (
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {group.apps.map((a) => (
          <a key={a.id} href={`https://${a.url}`} className={`text-lg hover:text-white ${accent}`}>
            {a.name}
          </a>
        ))}
      </div>
    );
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-8">
      {group.apps.map((a) => (
        <a key={a.id} href={`https://${a.url}`} className="flex items-center gap-4 hover:text-white">
          <Icon icon={a.icon} className={`size-12 shrink-0 ${accent}`} />
          <span>
            <span className={`block text-2xl ${accent}`}>{a.name}</span>
            <span className="block text-base text-[#9aa5c9]">{a.url}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

type DrawerProps = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  editing: App | null;
  setEditing: (id: string | null) => void;
  updateApp: (id: string, patch: Partial<App>) => void;
  deleteApp: (id: string) => void;
  addApp: () => void;
  addGroup: () => void;
  onClose: () => void;
};

function Drawer(p: DrawerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40" onClick={p.onClose} />
      <aside className="fixed top-0 left-0 flex h-full w-96 flex-col bg-[#0b1020] p-6 shadow-2xl">
        {p.editing ? (
          <EditForm app={p.editing} update={p.updateApp} remove={p.deleteApp} back={() => p.setEditing(null)} />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit startpage</h2>
              <button onClick={p.onClose} aria-label="Close">
                <Icon icon="lucide:x" />
              </button>
            </div>
            <div className="mb-4 flex gap-2 text-sm">
              <button onClick={p.addApp} className="rounded bg-[#1f2937] px-3 py-1.5 hover:text-white">
                + Add app
              </button>
              <button onClick={p.addGroup} className="rounded bg-[#1f2937] px-3 py-1.5 hover:text-white">
                + Add group
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <GroupList {...p} />
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function GroupList({ groups, setGroups, setEditing }: DrawerProps) {
  const [active, setActive] = useState<App | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const groupOf = (id: string) =>
    groups.find((g) => g.id === id || g.apps.some((a) => a.id === id));

  const onStart = (e: DragStartEvent) =>
    setActive(groups.flatMap((g) => g.apps).find((a) => a.id === e.active.id) ?? null);

  const onOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
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
    if (!over) return;
    const g = groupOf(String(active.id));
    if (!g) return;
    const oldI = g.apps.findIndex((a) => a.id === active.id);
    const newI = g.apps.findIndex((a) => a.id === over.id);
    if (newI >= 0 && oldI !== newI)
      setGroups((gs) => gs.map((x) => (x.id === g.id ? { ...x, apps: arrayMove(x.apps, oldI, newI) } : x)));
  };

  const moveGroup = (i: number, d: -1 | 1) =>
    setGroups((gs) => (i + d < 0 || i + d >= gs.length ? gs : arrayMove(gs, i, i + d)));

  const patchGroup = (id: string, patch: Partial<Group>) =>
    setGroups((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onStart} onDragOver={onOver} onDragEnd={onEnd}>
      {groups.map((g, i) => (
        <div key={g.id} className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm">
            <input
              value={g.name}
              placeholder={i === 0 ? "(unlabelled)" : "Group name"}
              onChange={(e) => patchGroup(g.id, { name: e.target.value })}
              className="min-w-0 flex-1 bg-transparent text-[#9aa5c9] uppercase outline-none placeholder:text-[#4b5d8a]"
            />
            <button
              onClick={() => patchGroup(g.id, { style: g.style === "tiles" ? "compact" : "tiles" })}
              className="text-xs text-[#6b7aa6] hover:text-white"
            >
              {g.style}
            </button>
            <button onClick={() => moveGroup(i, -1)} aria-label="Move group up">
              <Icon icon="lucide:arrow-up" />
            </button>
            <button onClick={() => moveGroup(i, 1)} aria-label="Move group down">
              <Icon icon="lucide:arrow-down" />
            </button>
          </div>
          <DropZone group={g} onSelect={setEditing} />
        </div>
      ))}
      <DragOverlay>{active && <Row app={active} />}</DragOverlay>
    </DndContext>
  );
}

function DropZone({ group, onSelect }: { group: Group; onSelect: (id: string) => void }) {
  const { setNodeRef } = useDroppable({ id: group.id });
  return (
    <SortableContext items={group.apps.map((a) => a.id)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="min-h-10 space-y-1 rounded border border-dashed border-[#1f2937] p-1">
        {group.apps.map((a) => (
          <SortableRow key={a.id} app={a} onSelect={onSelect} />
        ))}
      </div>
    </SortableContext>
  );
}

function SortableRow({ app, onSelect }: { app: App; onSelect: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
    >
      <Row app={app} onClick={() => onSelect(app.id)} />
    </div>
  );
}

function Row({ app, onClick }: { app: App; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-grab items-center gap-3 rounded bg-[#111827] px-3 py-2 hover:bg-[#1a2236]"
    >
      <Icon icon={app.icon} className={`size-5 ${accent}`} />
      <span className="flex-1 truncate">{app.name}</span>
      <Icon icon="lucide:chevron-right" className="text-[#4b5d8a]" />
    </div>
  );
}

export function EditForm(p: {
  app: App;
  update: (id: string, patch: Partial<App>) => void;
  remove: (id: string) => void;
  back: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (!query.trim()) return setResults([]);
    const ctl = new AbortController();
    const t = setTimeout(() => {
      fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=36`, { signal: ctl.signal })
        .then((r) => r.json())
        .then((d: { icons: string[] }) => setResults(d.icons))
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [query]);

  const field = "w-full rounded bg-[#111827] px-3 py-2 outline-none focus:ring-1 focus:ring-[#4b5d8a]";

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <button onClick={p.back} className="flex items-center gap-1 text-sm text-[#9aa5c9] hover:text-white">
        <Icon icon="lucide:arrow-left" /> Back
      </button>
      <label className="text-sm">
        Name
        <input className={field} value={p.app.name} onChange={(e) => p.update(p.app.id, { name: e.target.value })} />
      </label>
      <label className="text-sm">
        URL
        <input className={field} value={p.app.url} onChange={(e) => p.update(p.app.id, { url: e.target.value })} />
      </label>
      <div className="text-sm">
        Icon
        <div className="mb-2 flex items-center gap-3 text-[#6b7aa6]">
          <Icon icon={p.app.icon} className={`size-8 ${accent}`} /> {p.app.icon}
        </div>
        <input className={field} placeholder="Search icons..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="mt-2 grid grid-cols-6 gap-1">
          {results.map((name) => (
            <button
              key={name}
              title={name}
              onClick={() => p.update(p.app.id, { icon: name })}
              className="flex aspect-square items-center justify-center rounded hover:bg-[#1f2937]"
            >
              <Icon icon={name} className={`size-6 ${accent}`} />
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => p.remove(p.app.id)}
        className="mt-auto rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-red-400/10"
      >
        Delete app
      </button>
    </div>
  );
}
