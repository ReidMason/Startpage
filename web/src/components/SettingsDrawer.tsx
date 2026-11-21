import type { Settings } from "@/api";
import { isValidSearchEngine, searchEnginePresets } from "@/lib/settings";

type Props = {
  draft: Settings | undefined;
  dirty: boolean;
  saving: boolean;
  error: boolean;
  onChange: (draft: Settings) => void;
  onSave: () => void;
  onDiscard: () => void;
};

export function SettingsDrawer({ draft, dirty, saving, error, onChange, onSave, onDiscard }: Props) {
  const valid = !draft || isValidSearchEngine(draft.searchEngine);

  return (
    <aside
      aria-label="Settings"
      className="sticky top-0 flex h-screen w-80 shrink-0 flex-col overflow-y-auto bg-[#0b1020]"
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
                  className="rounded-full bg-[#1f2937] px-3 py-1 text-sm text-[#9aa5c9] hover:text-white aria-pressed:bg-[#c7d2fe] aria-pressed:text-[#111827]"
                >
                  {preset.name}
                </button>
              ))}
            </div>
            <input
              id="search-engine"
              type="text"
              value={draft.searchEngine}
              onChange={(e) => onChange({ ...draft, searchEngine: e.target.value })}
              aria-invalid={!valid}
              autoComplete="off"
              className="w-full rounded-lg bg-[#1f2937] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#c7d2fe]"
            />
            {!valid && <p className="text-sm text-red-400">Enter a valid http or https address.</p>}
          </section>
        )}
      </div>
      {dirty && (
        <div className="sticky bottom-0 space-y-2 bg-[#0b1020] p-4">
          {error && <p className="text-sm text-red-400">Could not save. Try again.</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={!valid || saving}
              className="flex-1 rounded-full bg-[#c7d2fe] px-4 py-2 text-sm font-semibold text-[#111827] disabled:opacity-40"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onDiscard}
              disabled={saving}
              className="flex-1 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
