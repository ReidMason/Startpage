import { StateSetter } from "@/utils/common";
import { Config, Provider } from "@/services/config/schemas";
import { useEffect, useRef, useState } from "react";
import { isValidUrl } from "@/utils/utils";

interface SearchBarProps {
  setAppFilter: StateSetter<string>;
  config: Config;
}

export default function Searchbar({ setAppFilter, config }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const input = useRef<HTMLInputElement>(null);

  const tryProviderSearch = (
    providers: Array<Provider>,
    searchTerm: string,
  ) => {
    // Don't check if there aren't any providers or the search term doesn't start with a slash
    if (!providers || !searchTerm.startsWith("/")) return false;

    // Search for words starting with a slash until a space or end of string
    const prefixMatches = searchTerm.match(/\/([^\s]+)/gm);
    if (prefixMatches === null || prefixMatches.length === 0) return false;

    // Extract prefix and search text
    const prefix = prefixMatches[0].replace("/", "").trim();
    const searchText = searchTerm.replace(prefixMatches[0], "").trim();

    // Now we are going to run the command
    for (const provider of providers || []) {
      if (provider.prefix.toLowerCase() === prefix.toLowerCase()) {
        // If there is search text we need to use it
        if (searchText.length > 0)
          window.location.href = provider.searchUrl + searchText;
        // If there isn't go to the base url
        else window.location.href = provider.baseUrl;

        return true;
      }
    }
  };

  const performWebSearch = (searchTerm: string) => {
    // Check if search term was url, if so just go straight to the page
    if (isValidUrl(searchTerm)) {
      window.location.href = searchTerm;
      return;
    }

    window.location.href =
      config.general.searchUrl + encodeURIComponent(searchTerm);
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();

    // Ignore blank search terms
    if (searchTerm === "") return;

    if (searchTerm[0] === "/")
      if (tryProviderSearch(config.providers, searchTerm)) return;

    // Fallback action is to perform a normal web search
    performWebSearch(searchTerm);
  };

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key == "/" &&
        input.current &&
        document.activeElement != input.current
      ) {
        input.current.focus();
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form onSubmit={search}>
      <input
        autoFocus
        ref={input}
        spellCheck="false"
        className="h-10 w-full border-0 border-b-2 border-accent-foreground/40 bg-transparent p-0 py-2 text-3xl outline-none placeholder:text-accent-foreground/80 focus:border-accent-foreground/60 focus:ring-0"
        placeholder={config.general.searchPlaceholder ?? ""}
        onChange={updateSearchTerm}
        aria-label="searchbar"
      />
    </form>
  );
}
