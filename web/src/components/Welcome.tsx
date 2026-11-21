import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

type Props = { editMode: boolean; searchEngine: string; showName: boolean };

export function Welcome({ editMode, searchEngine, showName }: Props) {
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
        onSubmit={(e) => {
          e.preventDefault();
          const query = new FormData(e.currentTarget).get("query")?.toString().trim();
          if (query) window.location.assign(searchEngine + encodeURIComponent(query));
        }}
      >
        <input
          name="query"
          type="text"
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
