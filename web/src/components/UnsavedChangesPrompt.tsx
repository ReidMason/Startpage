type Props = {
  saving: boolean;
  canSave: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onKeepEditing: () => void;
};

export function UnsavedChangesPrompt({ saving, canSave, onSave, onDiscard, onKeepEditing }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div role="alertdialog" aria-label="Unsaved changes" className="w-96 space-y-4 rounded-2xl bg-[#111827] p-6">
        <h2 className="text-lg font-semibold">Unsaved changes</h2>
        <p className="text-sm text-[#9aa5c9]">You have unsaved settings changes.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || saving}
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
          <button
            type="button"
            onClick={onKeepEditing}
            disabled={saving}
            className="flex-1 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
          >
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
}
