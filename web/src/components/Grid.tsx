import { Icon } from "@iconify/react";

import type { App, Group } from "@/api";
import { appHref, displayUrl } from "@/lib/startpage";

const accent = "text-[#b9c9f5]";

function AppIcon({ app, className }: { app: App; className: string }) {
  if (!app.iconSvg) return <span className={className} />;
  return <Icon icon={{ body: app.iconSvg, width: 24, height: 24 }} className={className} />;
}

export function Grid({ group }: { group: Group }) {
  if (group.style === "compact") {
    return (
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {group.apps.map((app) => (
          <a key={app.id} href={appHref(app.url)} className={`text-lg hover:text-white ${accent}`}>
            {app.name}
          </a>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-8">
      {group.apps.map((app) => (
        <a key={app.id} href={appHref(app.url)} className="flex min-w-0 items-center gap-4 hover:text-white">
          <AppIcon app={app} className={`size-12 shrink-0 ${accent}`} />
          <span className="min-w-0">
            <span className={`block truncate text-2xl ${accent}`}>{app.name}</span>
            <span className="block truncate text-base text-[#9aa5c9]">{displayUrl(app.url)}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
