import { describe, expect, it } from "vitest";

import { shouldFocusSearchOnSlash } from "@/lib/shortcut";

type Target = { tagName: string; isContentEditable?: boolean; inOverlay?: boolean };

const press = (target: Target, opts: { key?: string; editMode?: boolean; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean } = {}) =>
  shouldFocusSearchOnSlash(
    {
      key: opts.key ?? "/",
      ctrlKey: opts.ctrlKey ?? false,
      metaKey: opts.metaKey ?? false,
      altKey: opts.altKey ?? false,
      target: {
        tagName: target.tagName,
        isContentEditable: target.isContentEditable ?? false,
        closest: () => (target.inOverlay ? {} : null),
      },
    },
    opts.editMode ?? false,
  );

describe("shouldFocusSearchOnSlash", () => {
  it("fires for / on the page body", () => {
    expect(press({ tagName: "BODY" })).toBe(true);
  });

  it("fires for / on a focused link", () => {
    expect(press({ tagName: "A" })).toBe(true);
  });

  it("ignores other keys", () => {
    expect(press({ tagName: "BODY" }, { key: "a" })).toBe(false);
  });

  it("ignores / with a modifier", () => {
    expect(press({ tagName: "BODY" }, { ctrlKey: true })).toBe(false);
    expect(press({ tagName: "BODY" }, { metaKey: true })).toBe(false);
    expect(press({ tagName: "BODY" }, { altKey: true })).toBe(false);
  });

  it("ignores / in inputs, textareas, selects and editable elements", () => {
    expect(press({ tagName: "INPUT" })).toBe(false);
    expect(press({ tagName: "TEXTAREA" })).toBe(false);
    expect(press({ tagName: "SELECT" })).toBe(false);
    expect(press({ tagName: "DIV", isContentEditable: true })).toBe(false);
  });

  it("ignores / inside a modal or the settings drawer", () => {
    expect(press({ tagName: "BUTTON", inOverlay: true })).toBe(false);
  });

  it("does nothing in edit mode", () => {
    expect(press({ tagName: "BODY" }, { editMode: true })).toBe(false);
  });
});
