import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Icon } from "@iconify/react";
import { Icon as InlineSvgIcon } from "@iconify/react/offline";

import type { App, Group } from "@/api";
import { groupDropId, useJustDragged } from "@/components/ReorderContext";
import { appHref, displayUrl } from "@/lib/startpage";
import { accent } from "@/lib/utils";

function AppIcon({ app, className }: { app: App; className: string }) {
  if (!app.iconSvg) return <span className={className} />;
  return <InlineSvgIcon icon={{ body: app.iconSvg, width: 24, height: 24 }} className={className} />;
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

export function tileClass(style: Group["style"]) {
  return style === "compact" ? `text-lg hover:text-white ${accent}` : "flex min-w-0 items-center gap-4 hover:text-white";
}

function EditItem({ app, index, group, edit }: { app: App; index: number; group: Group; edit: GridEdit }) {
  const justDragged = useJustDragged();
  const { ref } = useSortable({ id: app.id, index, group: groupDropId(group.id), type: "app", accept: "app" });
  return (
    <button
      type="button"
      ref={ref}
      onClick={() => !justDragged() && edit.onSelect(app)}
      className={`${tileClass(group.style)} cursor-grab touch-none text-left data-[dnd-placeholder]:opacity-0`}
    >
      <AppTile app={app} style={group.style} />
    </button>
  );
}

export function Grid({ group, edit, highlightFirst }: { group: Group; edit?: GridEdit; highlightFirst?: boolean }) {
  const { ref } = useDroppable({ id: groupDropId(group.id), type: "group-drop", accept: "app", disabled: !edit });
  const add = edit && (
    <button
      type="button"
      onClick={edit.onAdd}
      className="flex items-center gap-3 text-[#6b7aa6] hover:text-white"
    >
      <Icon icon="lucide:plus" className="size-8" /> Add app
    </button>
  );
  const items = group.apps.map((app, i) =>
    edit ? (
      <EditItem key={app.id} app={app} index={i} group={group} edit={edit} />
    ) : (
      <a
        key={app.id}
        href={appHref(app.url)}
        className={`${tileClass(group.style)} ${highlightFirst && i === 0 ? "rounded-lg ring-2 ring-[#c7d2fe] ring-offset-4 ring-offset-[#111827]" : ""}`}
      >
        <AppTile app={app} style={group.style} />
      </a>
    ),
  );
  const layout = group.style === "compact" ? "flex flex-wrap gap-x-8 gap-y-2" : "grid grid-cols-4 gap-x-8 gap-y-8";
  return (
    <div ref={ref} className={`${layout} ${edit ? "min-h-16" : ""}`}>
      {items}
      {add}
    </div>
  );
}
