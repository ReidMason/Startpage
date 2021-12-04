import React, { useContext, useState } from 'react'
import PhilipsHueSetup from '../modules/PhilipsHueSetup'
import { SettingsContext } from '../modules/settings section/settingsContext';
import { IConfiguration } from '../services/ConfigService';
import { GlobalContext } from './startpage/globalContext';

export default function Settings() {
    const { config } = useContext(GlobalContext)!;
    const [modifiedConfig, setModifiedConfig] = useState<IConfiguration | null>(JSON.parse(JSON.stringify(config)));

    return (
        <SettingsContext.Provider value={{ modifiedConfig, setModifiedConfig }}>
            <div>
                <PhilipsHueSetup />
            </div>
        </SettingsContext.Provider>
    )
}
