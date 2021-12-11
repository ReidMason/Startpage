import React, { useContext } from 'react';
import { SettingsContext } from './settingsContext';
import { GlobalContext } from '../../views/startpage/globalContext';
import TextInput from '../../components/TextInput';
import SearchUrlPicker from '../../components/SearchUrlPicker';

export default function GeneralSettings() {
    const { config } = useContext(GlobalContext)!;
    const { modifiedConfig } = useContext(SettingsContext)!;

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl text-nord-4 semibold">General settings</h2>

            <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start max-w-5xl">
                    <TextInput placeholder="Search placeholder" defaultValue={config!.general.searchPlaceholder} setValue={(val: string) => (modifiedConfig!.general.searchPlaceholder = val)} />

                    <div className="flex flex-col gap-1">
                        <TextInput placeholder="Calendar url" defaultValue={config!.general.calendarUrl} setValue={(val: string) => (modifiedConfig!.general.calendarUrl = val)} />
                        <p className="text-sm ml-2 text-nord-9">Leaving this field blank will disable the calendar link</p>
                    </div>

                    <SearchUrlPicker className="md:col-span-2" />
                </div>
            </form>
        </div>
    )
}
