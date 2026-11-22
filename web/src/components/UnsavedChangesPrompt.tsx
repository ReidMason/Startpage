type Props = {
  saving: boolean;
  canSave: boolean;
  error: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onKeepEditing: () => void;
};

export function UnsavedChangesPrompt({ saving, canSave, error, onSave, onDiscard, onKeepEditing }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60">
      <div role="alertdialog" aria-label="Unsaved changes" className="w-96 space-y-4 rounded-2xl bg-card p-6">
        <h2 className="text-lg font-semibold">Unsaved changes</h2>
        <p className="text-sm text-muted-foreground">You have unsaved settings changes.</p>
        {error && <p className="text-sm text-destructive">Could not save. Try again.</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || saving}
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
          <button
            type="button"
            onClick={onKeepEditing}
            disabled={saving}
            className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
}
