import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { GlobalContext } from '../../modules/startpage/globalContext';
import SettingsTextField from '../SettingsTextField';
import Toggle from '../Toggle';

export default function WeatherSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;
    const { config } = useContext(GlobalContext)!;

    const updateModifiedConfig = () => {
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div>
            {config && modifiedConfig && <div className="grid grid-cols-1 gap-y-2">
                <p>{modifiedConfig.weather.enabled ? "Enabled" : "Disabled"}</p>
                <Toggle defaultValue={modifiedConfig.weather.enabled} setter={(val: boolean) => { modifiedConfig.weather.enabled = val; updateModifiedConfig(); }} />
                {/* <SettingsTextField disabled={!modifiedConfig.weather.enabled} label="Api key" defaultValue={config.weather.apiKey} setter={(val: string) => { modifiedConfig.weather.apiKey = val; updateModifiedConfig(); }} /> */}
                <SettingsTextField disabled={!modifiedConfig.weather.enabled} label="Location" defaultValue={config.weather.location} setter={(val: string) => { modifiedConfig.weather.location = val; updateModifiedConfig(); }} />
                {/* <SettingsTextField label="Cache duration" defaultValue={app.url} setter={(val: string) => { app.url = val; }} /> */}
            </div>}
        </div>
    )
}
