import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { fetchIconBody, searchIcons } from "@/lib/iconify";
import { accent } from "@/lib/utils";

export type AppDraft = { name: string; url: string; iconName: string; iconSvg: string };

const field = "w-full rounded bg-muted px-3 py-2 outline-none focus:ring-1 focus:ring-ring";

export function AppModal({
  initial,
  title,
  saving,
  error,
  onSave,
  onDelete,
  onCancel,
}: {
  initial: AppDraft;
  title: string;
  saving: boolean;
  error?: string;
  onSave: (draft: AppDraft) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searchFailed, setSearchFailed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const ctl = new AbortController();
    const t = setTimeout(() => {
      searchIcons(query, ctl.signal)
        .then((icons) => {
          setResults(icons);
          setSearchFailed(false);
        })
        .catch((e: unknown) => {
          if ((e as Error).name !== "AbortError") setSearchFailed(true);
        });
    }, 250);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [query]);

  const pickIcon = async (iconName: string) => {
    try {
      const iconSvg = await fetchIconBody(iconName);
      setDraft((d) => ({ ...d, iconName, iconSvg }));
    } catch {
      setSearchFailed(true);
    }
  };

  const valid = draft.name.trim() !== "" && draft.url.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <form
        role="dialog"
        aria-label={title}
        onSubmit={(e) => {
          e.preventDefault();
          if (valid && !saving) onSave(draft);
        }}
        className="flex max-h-[90vh] w-[28rem] flex-col gap-4 overflow-y-auto rounded-2xl bg-secondary p-6 text-foreground"
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <label className="text-sm">
          Name
          <input
            autoFocus
            className={field}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </label>
        <label className="text-sm">
          URL
          <input className={field} value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
        </label>
        <div className="text-sm">
          Icon
          <div className="mb-2 flex items-center gap-3 text-muted-foreground">
            {draft.iconName ? (
              <Icon icon={draft.iconName} width="100%" height="100%" className={`size-8 shrink-0 ${accent}`} />
            ) : (
              <span className="size-8" />
            )}
            {draft.iconName || "No icon"}
          </div>
          <input
            className={field}
            placeholder="Search icons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searchFailed && <p className="mt-2 text-destructive">Icon search unavailable offline.</p>}
          <div className="mt-2 grid grid-cols-6 gap-1">
            {results.map((name) => (
              <button
                type="button"
                key={name}
                title={name}
                onClick={() => void pickIcon(name)}
                className="flex aspect-square items-center justify-center rounded hover:bg-muted"
              >
                <Icon icon={name} className={`size-6 ${accent}`} />
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          {onDelete && (
            <button type="button" onClick={onDelete} className="mr-auto rounded px-4 py-2 text-sm text-destructive hover:text-destructive/80">
              Delete
            </button>
          )}
          <button type="button" onClick={onCancel} className="rounded px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid || saving}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
