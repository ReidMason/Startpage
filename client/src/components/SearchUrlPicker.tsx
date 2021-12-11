import React, { useContext, useState } from 'react'
import ListBoxOption from '../interfaces/ListBoxOption';
import { SettingsContext } from '../modules/settings/settingsContext';
import ListBox from './ListBox';
import TextInput from './TextInput';

const options = [
    { id: 2, name: 'Google', value: 'https://www.google.com/search?q=' },
    { id: 3, name: 'DuckDuckGo', value: 'https://duckduckgo.com/?q=' },
    { id: 4, name: 'Bing', value: 'https://www.bing.com/search?q=' },
    // Custom value needs to have id 1
    { id: 1, name: 'Custom', value: 'Custom' },
]

interface SearchUrlPickerProps {
    className?: string;
}


export default function SearchUrlPicker({ className }: SearchUrlPickerProps) {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const getDefaultSearchUrlOption = () => {
        if (modifiedConfig!.general.customSearchEnabled)
            return options.find(x => x.id === 1)!;

        var searchOption = options.find(x => x.value === modifiedConfig!.general.searchUrl);

        if (!searchOption)
            searchOption = options[0];

        return searchOption;
    }

    const [searchUrlOption, setSearchUrlOption] = useState<ListBoxOption>(getDefaultSearchUrlOption())

    const updateSearchUrl = (newSearchOption: ListBoxOption) => {
        setSearchUrlOption(newSearchOption);

        var searchUrlValue = newSearchOption.value;
        if (newSearchOption.id === 1) {
            modifiedConfig!.general.customSearchEnabled = true;
        }
        else {
            modifiedConfig!.general.customSearchEnabled = false;
            modifiedConfig!.general.searchUrl = searchUrlValue;
        }

        console.log(modifiedConfig!.general.customSearchEnabled);


        setModifiedConfig({ ...modifiedConfig! });
    }

    const customSearchUrl = searchUrlOption.id === 1;

    return (
        <div className={`${className} grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <ListBox label="Search url" options={options} setSelectedValue={updateSearchUrl} selectedValue={searchUrlOption} />
            <TextInput disabled={!customSearchUrl} placeholder="Custom search url" defaultValue={modifiedConfig!.general.customSearchUrl} setValue={(val: string) => (modifiedConfig!.general.customSearchUrl = val)} floatingLabel />
        </div>
    )
}
