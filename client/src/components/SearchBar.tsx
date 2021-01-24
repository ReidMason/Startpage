import React, { useContext, useState } from 'react';
import { GlobalContext } from "../modules/startpage/globalContext";


export default function SearchBar() {
    const { config } = useContext(GlobalContext)!;

    const [searchTerm, setSearchTerm] = useState<string>("");

    const search = (e: React.FormEvent) => {
        e.preventDefault();

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

    const tryProviderSearch = (searchTerm: string) => {
        // Don't check if there aren't any providers yet
        if (config && config.providers === null) {
            return false;
        }

        // This might be "a" for amazon or "yt" for youtube
        const prefix =
            searchTerm.substr(1, searchTerm.indexOf(" ") - 1) ||
            searchTerm.substr(1);
        // This is the term being searched for
        const searchText = encodeURIComponent(
            searchTerm.substr(2 + prefix.length)
        );

        // Now we are going to run the command
        for (const provider of config?.providers || []) {
            if (provider.prefix === prefix) {
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
        if (config)
            window.location.href = config.general.searchUrl + encodeURIComponent(searchTerm);
    }

    return (
        <div>
            <div className="w-full pb-2 px-1 border-b border-nord-9">
                <form onSubmit={search}>
                    <input autoFocus spellCheck="false" className="w-full bg-transparent outline-none h-10 text-3xl" placeholder={config?.general.searchPlaceholder} onChange={(event) => setSearchTerm(event.target.value.trim())}></input>
                </form>
            </div>
        </div>
    )
}
