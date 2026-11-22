import type { Settings, Theme } from "@/api";
import { themeLabel } from "@/lib/theme";
import { defaultSearchPlaceholder, isValidSearchEngine, maxSearchPlaceholderLength, searchEnginePresets } from "@/lib/settings";

type Props = {
  draft: Settings | undefined;
  themes: Theme[];
  dirty: boolean;
  saving: boolean;
  error: boolean;
  onChange: (draft: Settings) => void;
  onSave: () => void;
  onDiscard: () => void;
};

export function SettingsDrawer({ draft, themes, dirty, saving, error, onChange, onSave, onDiscard }: Props) {
  const valid = !draft || isValidSearchEngine(draft.searchEngine);

  return (
    <aside
      aria-label="Settings"
      className="sticky top-0 flex h-screen w-80 shrink-0 flex-col overflow-y-auto bg-background"
    >
      <div className="flex-1 space-y-4 p-6 pb-20">
        <h2 className="text-lg font-semibold">Settings</h2>
        {draft && (
          <section className="space-y-2">
            <label htmlFor="search-engine" className="block text-sm font-semibold">
              Search engine
            </label>
            <div className="flex flex-wrap gap-2">
              {searchEnginePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  aria-pressed={draft.searchEngine === preset.url}
                  onClick={() => onChange({ ...draft, searchEngine: preset.url })}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground hover:text-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                >
                  {preset.name}
                </button>
              ))}
            </div>
            <input
              id="search-engine"
              type="text"
              value={draft.searchEngine}
              onChange={(e) => onChange({ ...draft, searchEngine: e.target.value.trim() })}
              aria-invalid={!valid}
              autoComplete="off"
              className="w-full rounded-lg bg-secondary px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            {!valid && <p className="text-sm text-destructive">Enter a valid http or https address.</p>}
            <label htmlFor="search-placeholder" className="block pt-2 text-sm font-semibold">
              Search placeholder
            </label>
            <input
              id="search-placeholder"
              type="text"
              value={draft.searchPlaceholder}
              placeholder={defaultSearchPlaceholder}
              maxLength={maxSearchPlaceholderLength}
              onChange={(e) => onChange({ ...draft, searchPlaceholder: e.target.value })}
              autoComplete="off"
              className="w-full rounded-lg bg-secondary px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </section>
        )}
        {draft && (
          <label className="flex items-center justify-between gap-4 text-sm font-semibold">
            Theme
            <select
              value={draft.themeId == null ? "" : String(draft.themeId)}
              onChange={(e) => onChange({ ...draft, themeId: e.target.value === "" ? null : Number(e.target.value) })}
              className="rounded-lg bg-secondary px-3 py-2 text-sm font-normal outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">System</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {themeLabel(t.name)}
                </option>
              ))}
            </select>
          </label>
        )}
        {draft && (
          <label className="flex items-center justify-between gap-4 text-sm font-semibold">
            Show name in greeting
            <input
              type="checkbox"
              role="switch"
              checked={draft.showNameInGreeting}
              onChange={(e) => onChange({ ...draft, showNameInGreeting: e.target.checked })}
              className="size-4 accent-primary"
            />
          </label>
        )}
      </div>
      {dirty && (
        <div className="sticky bottom-0 space-y-2 bg-background p-4">
          {error && <p className="text-sm text-destructive">Could not save. Try again.</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={!valid || saving}
              className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onDiscard}
              disabled={saving}
              className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
