import React, { useState } from 'react';
import { Provider } from '../../interfaces/Config';

interface SearchBarProps {
    providers: Array<Provider>,
    customSearchEnabled: boolean,
    customSearchUrl: string,
    searchUrl: string,
    placeholder: string
    setAppFilter: Function,
}

export default function SearchBar({ providers, customSearchEnabled, customSearchUrl, searchUrl, placeholder, setAppFilter }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const search = () => {
        // Ignore blank search terms
        if (searchTerm === "") {
            setSearchTerm("");
            return;
        }

        // Not a command so just search the text
        if (searchTerm[0] === "/") {
            if (tryProviderSearch(searchTerm))
                return;
        }

        // Fallback action is to perform a normal web search
        performWebSearch(searchTerm);
    }

    const updateAppFilter = (searchTerm: string) => {
        // Apps search is either empty or invalid
        if (searchTerm[0] !== "." || searchTerm.length < 2) {
            setAppFilter("");
            return;
        }

        // Filter by apps containing the search words
        setAppFilter(searchTerm.substring(1).trim().toLowerCase());
    }

    const updateSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.trim();
        setSearchTerm(input);

        updateAppFilter(input);
    }

    const tryProviderSearch = (searchTerm: string) => {
        // Don't check if there aren't any providers yet
        if (providers === null) {
            return false;
        }

        // This might be "a" for amazon or "yt" for youtube
        const prefix =
            searchTerm.substring(1, searchTerm.indexOf(" ") - 1) ||
            searchTerm.substring(1);
        // This is the term being searched for
        const searchText = encodeURIComponent(
            searchTerm.substring(2 + prefix.length)
        );

        // Now we are going to run the command
        for (const provider of providers || []) {
            if (provider.prefix.toLowerCase() === prefix.toLowerCase()) {
                // If there is a space after the command we're doing a search
                if (searchTerm.indexOf(" ") > -1) {
                    window.location.href = provider.searchUrl + searchText;
                } else {
                    // If there isn't a space go to the base url
                    window.location.href = provider.baseUrl;
                }
                return true;
            }
        }
    }

    const performWebSearch = (searchTerm: string) => {
        try {
            new URL(searchTerm);
            window.location.href = searchTerm;
            return;
        } catch { }

        const chosenSearchUrl = customSearchEnabled ? customSearchUrl : searchUrl;
        window.location.href = chosenSearchUrl + encodeURIComponent(searchTerm);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter')
            search();
    }

    return (
        <div>
            <div className="w-full pb-2 px-1 border-b border-nord-9">
                <input autoFocus spellCheck="false" className="w-full bg-transparent outline-none h-10 text-3xl" placeholder={placeholder} onChange={updateSearchTerm} onKeyDown={handleKeyDown} aria-label="searchbar"></input>
            </div>
        </div>
    )
}
