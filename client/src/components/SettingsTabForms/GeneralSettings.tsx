import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { GlobalContext } from '../../modules/startpage/globalContext';
import SettingsTextField from '../SettingsTextField';

export default function GeneralSettings() {
    const { config } = useContext(GlobalContext)!;
    const { modifiedConfig } = useContext(SettingsContext)!;

    return (
        <div>
            <div>
                <form>
                    <div className="grid gap-y-4">
                        <SettingsTextField label="Search placeholder" defaultValue={config!.general.searchPlaceholder} setter={(val: string) => (modifiedConfig!.general.searchPlaceholder = val)} />
                        <SettingsTextField label="Search url" defaultValue={config!.general.searchUrl} setter={(val: string) => (modifiedConfig!.general.searchUrl = val)} />
                        {/* TODO: Add some presets for this: 
                                    https://www.google.co.uk/search?q= */}
                        <SettingsTextField label="Calendar url" defaultValue={config!.general.calendarUrl} setter={(val: string) => (modifiedConfig!.general.calendarUrl = val)} />
                        {/* TODO: Add explanation saying that leaving it blank will disable the link */}
                    </div>
                </form>
            </div>
        </div>
    )
}
