import React from 'react';
import Input from '../../../Input';
import SearchUrlPicker from './SearchUrlPicker';
import { Config } from '../../../../interfaces/Config';
import { SettingsSectionProps } from '../../../../pages/settings';

export default function GeneralSettings({ config, modifiedConfig, setModifiedConfig, saveNewConfig }: SettingsSectionProps) {
    const updateModifiedConfig = (newModifiedConfig: Config) => {
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
                    <Input placeholder="Search placeholder" defaultValue={config.general.searchPlaceholder} setValue={updateSearchPlaceholder} />

                    <div className="flex flex-col gap-1">
                        <Input placeholder="Calendar url" defaultValue={config.general.calendarUrl} setValue={updateSearchUrl} />
                        <p className="text-sm ml-2 text-nord-9">Leaving this field blank will disable the calendar link</p>
                    </div>

                    <SearchUrlPicker className="md:col-span-2" config={config} modifiedConfig={modifiedConfig} setModifiedConfig={setModifiedConfig} saveNewConfig={saveNewConfig} />
                </div>
            </form>
        </div>
    )
}
