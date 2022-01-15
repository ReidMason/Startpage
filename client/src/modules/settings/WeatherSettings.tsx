import React, { useContext } from 'react'
import TextInput from '../../components/TextInput';
import Toggle from '../../components/Toggle';
import { GlobalContext } from '../../views/startpage/globalContext';
import { SettingsContext } from './settingsContext';

export default function WeatherSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;
    const { config } = useContext(GlobalContext)!;

    const updateModifiedConfig = () => {
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div className="p-4">
            {config && modifiedConfig &&
                <div className="flex flex-col gap-4">
                    <div className="md:flex md:w-96 md:justify-between">
                        <div className="flex flex-col gap-2">
                            <p className="text-nord-4">Weather display</p>
                            <div className="flex gap-2">
                                <Toggle defaultValue={modifiedConfig.weather.enabled} setter={(val: boolean) => { modifiedConfig.weather.enabled = val; updateModifiedConfig(); }} />
                                <p className="text-nord-4">{modifiedConfig.weather.enabled ? "Enabled" : "Disabled"}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-nord-4">Detailed weather display</p>
                            <div className="flex gap-4">
                                <Toggle disabled={!modifiedConfig.weather.enabled} defaultValue={modifiedConfig.weather.detailed} setter={(val: boolean) => { modifiedConfig.weather.detailed = val; updateModifiedConfig(); }} />
                                <p className="text-nord-4">{modifiedConfig.weather.detailed ? "Enabled" : "Disabled"}</p>
                            </div>
                        </div>
                    </div>

                    <TextInput className="w-96" disabled={!modifiedConfig.weather.enabled} placeholder="Location" defaultValue={config.weather.location} setValue={(val: string) => { modifiedConfig.weather.location = val; updateModifiedConfig(); }} />
                </div>
            }
        </div>
    )
}