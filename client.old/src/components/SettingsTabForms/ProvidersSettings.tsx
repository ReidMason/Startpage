import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { generateUuid } from '../../utils';
import Button from '../Button';
import ProviderForm from './ProviderForm';

export default function ProvidersSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const removeProvider = (providerId: string) => {
        modifiedConfig!.providers = modifiedConfig!.providers.filter((provider) => (provider.id !== providerId))
        setModifiedConfig({ ...modifiedConfig! });
    }

    const createNewProvider = () => {
        modifiedConfig!.providers.push({ id: generateUuid(), name: "", baseUrl: "", prefix: "", searchUrl: "" });
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {modifiedConfig!.providers.map((provider) => (
                <div className="border border-nord-4 border-opacity-40 rounded p-2 lg:grid lg:grid-cols-3 lg:gap-8" key={provider.id}>
                    <div className="col-span-2">
                        <ProviderForm provider={provider} />
                    </div>
                    <div className="flex justify-end">
                        <div className="mt-auto w-24">
                            <Button onClick={() => (removeProvider(provider.id))} colour="red">Delete</Button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="w-32">
                <Button onClick={createNewProvider} colour="green">New provider</Button>
            </div>
        </div>
    )
}
