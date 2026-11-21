import { useQuery } from "@tanstack/react-query";

import { CollapsibleGroup } from "@/components/CollapsibleGroup";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDisplayName, meQueryKey, readCachedName, signOut } from "@/lib/session";
import { fetchStartpage, readCachedStartpage, startpageQueryKey } from "@/lib/startpage";

export function App() {
  const { data: name } = useQuery({
    queryKey: meQueryKey,
    queryFn: fetchDisplayName,
    initialData: readCachedName,
    initialDataUpdatedAt: 0,
    retry: false,
  });
  const { data: startpage } = useQuery({
    queryKey: startpageQueryKey,
    queryFn: fetchStartpage,
    initialData: readCachedStartpage,
    initialDataUpdatedAt: 0,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-[#1f2937] p-8 font-sans text-[#c7d2fe]">
      <main className="mx-auto max-w-6xl rounded-3xl bg-[#111827] p-16">
        <div className="mb-12 text-5xl font-bold">
          {name ? `Hello, ${name}` : <Skeleton className="h-12 w-72" />}
        </div>
        {startpage ? (
          <div className="space-y-10">
            {startpage.groups.map((group, i) => (
              <CollapsibleGroup key={group.id} group={group} labelled={i > 0 && !!group.name} />
            ))}
          </div>
        ) : (
          <Skeleton className="h-24 w-full" />
        )}
      </main>
      <button
        onClick={() => void signOut()}
        className="fixed right-6 bottom-6 rounded-full bg-[#1f2937] px-4 py-2 text-sm text-[#9aa5c9] hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}
