import React, { useContext } from 'react';
import { SettingsContext } from './settingsContext';
import { GlobalContext } from '../../views/startpage/globalContext';
import SettingsTextField from '../../components/SettingsTextField';
import TextInput from '../../components/TextInput';

export default function GeneralSettings() {
    const { config } = useContext(GlobalContext)!;
    const { modifiedConfig } = useContext(SettingsContext)!;

    return (
        <div className="flex flex-col gap-4 w-48">
            <h2 className="text-xl text-nord-4 semibold">General settings</h2>

            <form>
                <div className="flex flex-col gap-4 w-96">
                    <TextInput placeholder="Search placeholder" defaultValue={config!.general.searchPlaceholder} setValue={(val: string) => (modifiedConfig!.general.searchPlaceholder = val)} floatingLabel />
                    <TextInput placeholder="Search url" defaultValue={config!.general.searchUrl} setValue={(val: string) => (modifiedConfig!.general.searchUrl = val)} floatingLabel />
                    {/* TODO: Add some presets for this: 
                                    https://www.google.co.uk/search?q= */}
                    <TextInput placeholder="Calendar url" defaultValue={config!.general.calendarUrl} setValue={(val: string) => (modifiedConfig!.general.calendarUrl = val)} floatingLabel />
                    {/* TODO: Add explanation saying that leaving it blank will disable the link */}
                </div>
            </form>
        </div>
    )
}
