import { useState } from "react";
import type { StateSetter } from "../../../../types/common";
import type { Config, Provider } from "../../../backend/routers/config/schemas";
import useConfig from "../../../hooks/useConfig";

interface SearchBarProps {
  setAppFilter: StateSetter<string>;
}

export default function Searchbar({ setAppFilter }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchRequested, setSearchRequested] = useState(false);

  const checkSearchRequested = (data: Config) => {
    if (searchRequested) search(data);
  };

  const { config } = useConfig(checkSearchRequested);

  const tryProviderSearch = (
    providers: Array<Provider>,
    searchTerm: string
  ) => {
    // Don't check if there aren't any providers yet or the search term doesn't start with a slash
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

  const performWebSearch = (configData: Config, searchTerm: string) => {
    // Check if search term was url, if so just go straight to the page
    try {
      new URL(searchTerm);
      window.location.href = searchTerm;
      return;
    } catch {}

    const chosenSearchUrl = configData.general.customSearchEnabled
      ? configData.general.customSearchUrl
      : configData.general.searchUrl;
    window.location.href = chosenSearchUrl + encodeURIComponent(searchTerm);
  };

  const search = (data?: Config) => {
    // Ignore blank search terms
    if (searchTerm === "") return;

    const configData = data ?? config.data;
    console.log("Config data", !configData);

    // If the config hasn't been loaded yet we queue up the search
    if (data === undefined && (config.isLoading || config.isIdle)) {
      setSearchRequested(true);
      return;
    }

    if (!configData) {
      console.error("Config data is missing");
      return;
    }

    if (searchTerm[0] === "/")
      if (tryProviderSearch(configData.providers, searchTerm)) return;

    // Fallback action is to perform a normal web search
    performWebSearch(configData, searchTerm);
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
