import React from 'react'
import { SettingsSectionProps } from '../../../../pages/settings';
import TextInput from '../../../Input';
import Toggle from '../../../Toggle';

export default function WeatherSettings({ config, modifiedConfig, setModifiedConfig, saveNewConfig }: SettingsSectionProps) {
    const updateModifiedConfig = () => {
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        // TODO: Add input field for the weather api. This is no longer an environment variable.
        <div className="p-4">
            {config && modifiedConfig &&
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-nord-4">Weather display</p>
                        <div className="flex gap-2 my-auto">
                            <Toggle defaultValue={modifiedConfig.weather.enabled} setter={(val: boolean) => { modifiedConfig.weather.enabled = val; updateModifiedConfig(); }} />
                            <p className="text-nord-4">{modifiedConfig.weather.enabled ? "Enabled" : "Disabled"}</p>
                        </div>
                    </div>
                    <TextInput className="w-96" disabled={!modifiedConfig.weather.enabled} placeholder="Api key" defaultValue={config.weather.apiKey} setValue={(val: string) => { modifiedConfig.weather.apiKey = val; updateModifiedConfig(); }} />

                    <TextInput className="w-96" disabled={!modifiedConfig.weather.enabled} placeholder="Location" defaultValue={config.weather.location} setValue={(val: string) => { modifiedConfig.weather.location = val; updateModifiedConfig(); }} />

                    <div className="flex flex-col gap-2">
                        <p className="text-nord-4">Detailed weather display</p>
                        <div className="flex gap-4 my-auto">
                            <Toggle disabled={!modifiedConfig.weather.enabled} defaultValue={modifiedConfig.weather.detailed} setter={(val: boolean) => { modifiedConfig.weather.detailed = val; updateModifiedConfig(); }} />
                            <p className="text-nord-4">{modifiedConfig.weather.detailed ? "Enabled" : "Disabled"}</p>
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}