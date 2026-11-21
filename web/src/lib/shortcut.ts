const overlaySelector = "[role='dialog'], [role='alertdialog'], aside";
const textFields = new Set(["INPUT", "TEXTAREA", "SELECT"]);

type SlashEvent = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  target: { tagName: string; isContentEditable: boolean; closest: (selector: string) => unknown } | null;
};

export function shouldFocusSearchOnSlash(e: SlashEvent, editMode: boolean): boolean {
  if (editMode || e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || !e.target) return false;
  if (textFields.has(e.target.tagName) || e.target.isContentEditable) return false;
  return !e.target.closest(overlaySelector);
}
