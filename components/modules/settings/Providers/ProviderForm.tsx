import React from 'react';
import { Config, Provider } from '../../../../interfaces/Config';
import TextInput from '../../../Input';

interface ProviderFormProps {
    provider: Provider;
    modifiedConfig: Config;
    setModifiedConfig: Function;
}

export default function ProviderForm({ modifiedConfig, setModifiedConfig, provider }: ProviderFormProps) {
    const updateProvider = () => {
        modifiedConfig!.providers = modifiedConfig!.providers.map((originalProvider) => (originalProvider.id === provider.id ? provider : originalProvider));
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextInput placeholder="Name" defaultValue={provider.name} setValue={(val: string) => { provider.name = val; updateProvider(); }} />
            <TextInput placeholder="Prefix" defaultValue={provider.prefix} setValue={(val: string) => { provider.prefix = val; updateProvider(); }} />
            <TextInput className="md:col-span-2 xl:col-span-1" placeholder="Search Url" defaultValue={provider.searchUrl} setValue={(val: string) => { provider.searchUrl = val; updateProvider(); }} />
            <TextInput className="md:col-span-2 xl:col-span-1" placeholder="Base Url" defaultValue={provider.baseUrl} setValue={(val: string) => { provider.baseUrl = val; updateProvider(); }} />
        </div>
    )
}
