import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";

import type { App, Group } from "@/api";
import { groupDropId, useJustDragged } from "@/components/ReorderContext";
import { appHref, displayUrl } from "@/lib/startpage";
import { accent } from "@/lib/utils";

function AppIcon({ app, className }: { app: App; className: string }) {
  if (!app.iconSvg) return <span className={className} />;
  return <Icon icon={{ body: app.iconSvg, width: 24, height: 24 }} className={className} />;
}

export type GridEdit = { onSelect: (app: App) => void; onAdd: () => void };

export function AppTile({ app, style }: { app: App; style: Group["style"] }) {
  if (style === "compact") return <>{app.name}</>;
  return (
    <>
      <AppIcon app={app} className={`size-12 shrink-0 ${accent}`} />
      <span className="min-w-0">
        <span className={`block truncate text-2xl ${accent}`}>{app.name}</span>
        <span className="block truncate text-base text-[#9aa5c9]">{displayUrl(app.url)}</span>
      </span>
    </>
  );
}

function tileClass(style: Group["style"]) {
  return style === "compact" ? `text-lg hover:text-white ${accent}` : "flex min-w-0 items-center gap-4 hover:text-white";
}

function EditItem({ app, style, edit }: { app: App; style: Group["style"]; edit: GridEdit }) {
  const justDragged = useJustDragged();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id });
  return (
    <button
      type="button"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => !justDragged() && edit.onSelect(app)}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`${tileClass(style)} cursor-grab touch-none text-left`}
    >
      <AppTile app={app} style={style} />
    </button>
  );
}

export function Grid({ group, edit }: { group: Group; edit?: GridEdit }) {
  const { setNodeRef } = useDroppable({ id: groupDropId(group.id), disabled: !edit });
  const add = edit && (
    <button
      type="button"
      onClick={edit.onAdd}
      className="flex items-center gap-3 text-[#6b7aa6] hover:text-white"
    >
      <Icon icon="lucide:plus" className="size-8" /> Add app
    </button>
  );
  const items = group.apps.map((app) =>
    edit ? (
      <EditItem key={app.id} app={app} style={group.style} edit={edit} />
    ) : (
      <a key={app.id} href={appHref(app.url)} className={tileClass(group.style)}>
        <AppTile app={app} style={group.style} />
      </a>
    ),
  );
  const layout = group.style === "compact" ? "flex flex-wrap gap-x-8 gap-y-2" : "grid grid-cols-4 gap-x-8 gap-y-8";
  const body = (
    <div ref={setNodeRef} className={`${layout} ${edit ? "min-h-16" : ""}`}>
      {items}
      {add}
    </div>
  );
  if (!edit) return body;
  return (
    <SortableContext items={group.apps.map((a) => a.id)} strategy={rectSortingStrategy}>
      {body}
    </SortableContext>
  );
}
