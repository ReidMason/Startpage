import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type RefObject } from "react";

import type { App } from "@/api";
import { submitTarget, urlTarget } from "@/lib/filter";
import { defaultSearchPlaceholder } from "@/lib/settings";

import { fetchDisplayName, meQueryKey, readCachedName } from "@/lib/session";
import { shouldFocusSearchOnSlash } from "@/lib/shortcut";

const greetingFor = (now: Date) => {
  const hour = now.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const ordinal = (day: number) => {
  if (day >= 11 && day <= 13) return `${day}th`;
  return `${day}${["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : day % 10]}`;
};

const formatDate = (now: Date) => {
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
  const month = now.toLocaleDateString("en-GB", { month: "long" });
  const day = now.getDate();
  return (
    <>
      {weekday}, {day}
      <sup>{ordinal(day).slice(String(day).length)}</sup> {month} {now.getFullYear()}
    </>
  );
};

type Props = {
  editMode: boolean;
  searchEngine: string;
  searchPlaceholder: string;
  showName: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onEscape: () => void;
  bestMatch: App | undefined;
  inputRef: RefObject<HTMLInputElement | null>;
  onFocusChange: (focused: boolean) => void;
};

export function Welcome({ editMode, searchEngine, searchPlaceholder, showName, query, onQueryChange, onEscape, bestMatch, inputRef, onFocusChange }: Props) {
  const { data: name } = useQuery({
    queryKey: meQueryKey,
    queryFn: fetchDisplayName,
    initialData: readCachedName,
    initialDataUpdatedAt: 0,
    retry: false,
    enabled: showName,
  });
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!shouldFocusSearchOnSlash(e, editMode)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editMode]);

  const isLink = urlTarget(query) !== null;

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          name="query"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onEscape();
            } else if (e.key === "Enter") {
              e.preventDefault();
              const target = submitTarget({ query, searchEngine, best: bestMatch, forceSearch: e.shiftKey });
              if (target) window.location.assign(target);
            }
          }}
          autoFocus={!editMode}
          disabled={editMode}
          autoComplete="off"
          placeholder={searchPlaceholder || defaultSearchPlaceholder}
          aria-label="Search"
          className={`w-full border-0 border-b-2 border-foreground/40 bg-transparent pt-2 pb-4 text-3xl outline-none ${isLink ? "text-primary underline" : "text-foreground"} placeholder:text-muted-foreground focus:border-foreground/60 disabled:opacity-40`}
        />
      </form>
      <div>
        <div className="mb-3 text-xl font-semibold">{formatDate(now)}</div>
        <div className="text-4xl font-bold md:text-5xl">{showName && name ? `${greetingFor(now)}, ${name}` : greetingFor(now)}</div>
      </div>
    </div>
  );
}
