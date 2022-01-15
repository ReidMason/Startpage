import React, { useCallback, useContext, useEffect, useState } from 'react'
import ListBoxOption from '../interfaces/ListBoxOption';
import { SettingsContext } from '../modules/settings/settingsContext';
import { GlobalContext } from '../views/startpage/globalContext';
import ListBox from './ListBox';
import TextInput from './TextInput';

const options = [
    { id: 2, name: 'Google (UK)', value: 'https://www.google.co.uk/search?q=' },
    { id: 3, name: 'Google (US)', value: 'https://www.google.com/search?q=' },
    { id: 4, name: 'DuckDuckGo', value: 'https://duckduckgo.com/?q=' },
    { id: 5, name: 'Bing', value: 'https://www.bing.com/search?q=' },
    // Custom value needs to have id 1
    { id: 1, name: 'Custom', value: 'Custom' },
]

interface SearchUrlPickerProps {
    className?: string;
}


export default function SearchUrlPicker({ className }: SearchUrlPickerProps) {
    const { config } = useContext(GlobalContext)!;
    const { modifiedConfig, setModifiedConfig, saveNewConfig } = useContext(SettingsContext)!;

    const getSelectedSearchUrlOption = useCallback(
        () => {
            if (modifiedConfig!.general.customSearchEnabled)
                return options.find(x => x.id === 1)!;

            var searchOption = options.find(x => x.value === modifiedConfig!.general.searchUrl);

            if (!searchOption)
                searchOption = options[0];

            return searchOption;
        },
        [modifiedConfig],
    )

    const [searchUrlOption, setSearchUrlOption] = useState<ListBoxOption>(getSelectedSearchUrlOption());

    useEffect(() => {
        // Set the selected search url option
        setSearchUrlOption(getSelectedSearchUrlOption());
    }, [modifiedConfig, getSelectedSearchUrlOption])


    const updateSearchUrl = (newSearchOption: ListBoxOption) => {
        setSearchUrlOption(newSearchOption);

        var searchUrlValue = newSearchOption.value;
        // If id is 1 we know this is a custom option
        if (newSearchOption.id === 1) {
            modifiedConfig!.general.customSearchEnabled = true;
        }
        else {
            modifiedConfig!.general.customSearchEnabled = false;
            modifiedConfig!.general.searchUrl = searchUrlValue;
        }

        setModifiedConfig({ ...modifiedConfig! });
    }

    const updateCustomSearchUrl = (newCustomSearchUrl: string) => {
        modifiedConfig!.general.customSearchUrl = newCustomSearchUrl;
        setModifiedConfig({ ...modifiedConfig! });
    }

    const customSearchUrl = searchUrlOption.id === 1;

    const isCustomSearchUrl = useCallback(
        () => {
            const selectedOption = options.find(x => x.value === modifiedConfig?.general.searchUrl)

            return selectedOption === undefined;
        },
        [modifiedConfig]
    )

    useEffect(() => {
        if (!config!.general.customSearchEnabled && isCustomSearchUrl()) {
            // The loaded search url is identified as a custom search url so we need to update the config to reflect this
            // Set the custom search enabled to true and update the custom search url to be the current search url and save the config
            config!.general.customSearchEnabled = true;
            config!.general.customSearchUrl = config!.general.searchUrl;
            saveNewConfig(config!);
        }
    }, [config, saveNewConfig, isCustomSearchUrl])

    return (
        <div className={`${className} grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <ListBox label="Search url" options={options} setSelectedValue={updateSearchUrl} selectedValue={searchUrlOption} />
            <TextInput disabled={!customSearchUrl} placeholder="Custom search url" defaultValue={modifiedConfig!.general.customSearchUrl} setValue={updateCustomSearchUrl} floatingLabel />
        </div>
    )
}
