import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type RefObject } from "react";

import type { App } from "@/api";
import { submitTarget } from "@/lib/filter";

import { fetchDisplayName, meQueryKey, readCachedName } from "@/lib/session";

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
  return `${weekday}, ${ordinal(now.getDate())} ${month} ${now.getFullYear()}`;
};

type Props = {
  editMode: boolean;
  searchEngine: string;
  showName: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  bestMatch: App | undefined;
  inputRef: RefObject<HTMLInputElement | null>;
  onFocusChange: (focused: boolean) => void;
};

export function Welcome({ editMode, searchEngine, showName, query, onQueryChange, bestMatch, inputRef, onFocusChange }: Props) {
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

  return (
    <div className="mb-12">
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
              onQueryChange("");
            } else if (e.key === "Enter") {
              e.preventDefault();
              const target = submitTarget({ query, searchEngine, best: bestMatch, forceSearch: e.shiftKey });
              if (target) window.location.assign(target);
            }
          }}
          autoFocus={!editMode}
          disabled={editMode}
          autoComplete="off"
          placeholder="Search"
          aria-label="Search"
          className="w-full border-0 border-b border-[#374151] bg-transparent pb-3 text-2xl text-[#c7d2fe] outline-none placeholder:text-[#6b7aa6] focus:border-[#c7d2fe] disabled:opacity-40"
        />
      </form>
      <div className="mt-10 text-lg text-[#9aa5c9]">{formatDate(now)}</div>
      <div className="mt-2 text-5xl font-bold">{showName && name ? `${greetingFor(now)}, ${name}` : greetingFor(now)}</div>
    </div>
  );
}
