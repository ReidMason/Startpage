import { useCallback, useEffect, useState } from "react";
import { StateSetter } from "../../../../types/common";
import useConfig from "../../../hooks/useConfig";

interface SearchBarProps {
  setAppFilter: StateSetter<string>;
}

export default function Searchbar({ setAppFilter }: SearchBarProps) {
  const { config } = useConfig();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchRequested, setSearchRequested] = useState(true);

  const tryProviderSearch = useCallback(
    (searchTerm: string) => {
      // Don't check if there aren't any providers yet or the search term doesn't start with a slash
      if (!config.data?.providers || !searchTerm.startsWith("/")) return false;

      // Search for words starting with a slash until a space or end of string
      const prefixMatches = searchTerm.match(/\/([^\s]+)/gm);
      if (prefixMatches === null || prefixMatches.length === 0) return false;

      // Extract prefix and search text
      const prefix = prefixMatches[0].replace("/", "").trim();
      const searchText = searchTerm.replace(prefixMatches[0], "").trim();

      // Now we are going to run the command
      for (const provider of config.data?.providers || []) {
        if (provider.prefix.toLowerCase() === prefix.toLowerCase()) {
          // If there is search text we need to use it
          if (searchText.length > 0)
            window.location.href = provider.searchUrl + searchText;
          // If there isn't go to the base url
          else window.location.href = provider.baseUrl;

          return true;
        }
      }
    },
    [config.data]
  );

  const performWebSearch = useCallback(
    (searchTerm: string) => {
      // Check if search term was url, if so just go straight to the page
      try {
        new URL(searchTerm);
        window.location.href = searchTerm;
        return;
      } catch {}

      const chosenSearchUrl = config.data!.general.customSearchEnabled
        ? config.data!.general.customSearchUrl
        : config.data!.general.searchUrl;
      window.location.href = chosenSearchUrl + encodeURIComponent(searchTerm);
    },
    [config.data]
  );

  const search = useCallback(() => {
    // Ignore blank search terms
    if (searchTerm === "") return;

    // If the config hasn't been loaded yet we queue up the search
    if (config.isLoading) {
      setSearchRequested(true);
      return;
    }

    if (config.data)
      if (searchTerm[0] === "/") {
        // Not a command so just search the text
        if (tryProviderSearch(searchTerm)) return;
      }

    // Fallback action is to perform a normal web search
    performWebSearch(searchTerm);
  }, [searchTerm, tryProviderSearch, performWebSearch, config]);

  useEffect(() => {
    // If we have a queued search execute it immediately
    if (searchRequested && !config.isLoading) search();
  }, [config.isLoading, search, searchRequested]);

  const updateAppFilter = (searchTerm: string) => {
    // Apps search is either empty or invalid
    if (searchTerm[0] !== "." || searchTerm.length < 2) {
      setAppFilter("");
      return;
    }

    // Filter by apps containing the search words
    setAppFilter(searchTerm.substring(1).trim().toLowerCase());
  };

  const updateSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setSearchTerm(input);

    updateAppFilter(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  return (
    <input
      autoFocus
      spellCheck="false"
      className="h-10 w-full border-b-2 border-primary-200/40 bg-transparent py-2 text-3xl outline-none placeholder:text-primary-50/80"
      placeholder={config.data?.general.searchPlaceholder ?? ""}
      onChange={updateSearchTerm}
      onKeyDown={handleKeyDown}
      aria-label="searchbar"
    />
  );
}
