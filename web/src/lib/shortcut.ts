const overlaySelector = "[role='dialog'], [role='alertdialog'], aside";
const textFields = new Set(["INPUT", "TEXTAREA", "SELECT"]);

type SlashEvent = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  target: EventTarget | ElementLike | null;
};

type ElementLike = { tagName: string; isContentEditable: boolean; closest: (selector: string) => unknown };

export function shouldFocusSearchOnSlash(e: SlashEvent, editMode: boolean): boolean {
  const target = e.target as ElementLike | null;
  if (editMode || e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || !target) return false;
  if (textFields.has(target.tagName) || target.isContentEditable) return false;
  return !target.closest(overlaySelector);
}
