import React, { useContext, useState } from 'react'
import Button from '../components/Button';
import PhilipsHueSettings from '../modules/settings/PhilipsHueSettings'
import GeneralSettings from '../modules/settings/GeneralSettings';
import { SettingsContext } from '../modules/settings/settingsContext';
import { IConfiguration, saveConfig } from '../services/ConfigService';
import { GlobalContext } from './startpage/globalContext';
import AppSettings from '../modules/settings/AppSettings';

export default function Settings() {
    const { config, setConfig } = useContext(GlobalContext)!;
    const [modifiedConfig, setModifiedConfig] = useState<IConfiguration | null>(JSON.parse(JSON.stringify(config)));

    const saveConfigChanges = () => {
        if (config && modifiedConfig) {
            saveConfig(modifiedConfig).then(res => {
                if (res.data)
                    setConfig({ ...modifiedConfig });
            });
        }
    }

    return (
        <SettingsContext.Provider value={{ modifiedConfig, setModifiedConfig }}>
            <div className="flex flex-col gap-8 m-2">
                <PhilipsHueSettings />
                <hr />
                <GeneralSettings />
                <hr />
                <AppSettings />
            </div>
            <Button onClick={saveConfigChanges}>Save</Button>
        </SettingsContext.Provider>
    )
}
