import React, { useContext } from 'react';
import { SettingsContext } from './settingsContext';
import { GlobalContext } from '../../views/startpage/globalContext';
import TextInput from '../../components/TextInput';
import SearchUrlPicker from '../../components/SearchUrlPicker';
import { IConfiguration } from '../../services/ConfigService';

export default function GeneralSettings() {
    const { config } = useContext(GlobalContext)!;
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const updateModifiedConfig = (newModifiedConfig: IConfiguration) => {
        setModifiedConfig({ ...newModifiedConfig })
    }

    const updateSearchPlaceholder = (newSearchPlaceholder: string) => {
        modifiedConfig!.general.searchPlaceholder = newSearchPlaceholder;
        updateModifiedConfig(modifiedConfig!);
    }

    const updateSearchUrl = (newSearchUrl: string) => {
        modifiedConfig!.general.calendarUrl = newSearchUrl;
        updateModifiedConfig(modifiedConfig!);
    }

    return (
        <div className="p-4">
            <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start max-w-5xl">
                    <TextInput placeholder="Search placeholder" defaultValue={config!.general.searchPlaceholder} setValue={updateSearchPlaceholder} />

                    <div className="flex flex-col gap-1">
                        <TextInput placeholder="Calendar url" defaultValue={config!.general.calendarUrl} setValue={updateSearchUrl} />
                        <p className="text-sm ml-2 text-nord-9">Leaving this field blank will disable the calendar link</p>
                    </div>

                    <SearchUrlPicker className="md:col-span-2" />
                </div>
            </form>
        </div>
    )
}
