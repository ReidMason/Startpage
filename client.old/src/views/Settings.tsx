import React, { useContext, useState } from 'react'
import Button from '../components/Button';
import PhilipsHueSetup from '../modules/PhilipsHueSetup'
import GeneralSettings from '../modules/settings section/GeneralSettings';
import { SettingsContext } from '../modules/settings section/settingsContext';
import { IConfiguration, saveConfig } from '../services/ConfigService';
import { GlobalContext } from './startpage/globalContext';

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
            <div className="flex flex-col gap-8 m-24">
                <PhilipsHueSetup />
                <hr />
                <GeneralSettings />
                <hr />
            </div>
            <Button onClick={saveConfigChanges}>Save</Button>
        </SettingsContext.Provider>
    )
}
