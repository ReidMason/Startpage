import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { IProvider } from '../../services/ConfigService';
import SettingsTextField from '../SettingsTextField';

interface ProviderFormProps {
    provider: IProvider;
}

export default function ProviderForm({ provider }: ProviderFormProps) {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const updateProvider = () => {
        modifiedConfig!.providers = modifiedConfig!.providers.map((originalProvider) => (originalProvider.id === provider.id ? provider : originalProvider));
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div>
            <SettingsTextField label="Name" defaultValue={provider.name} setter={(val: string) => { provider.name = val; updateProvider(); }} />
            <SettingsTextField label="Prefix" defaultValue={provider.prefix} setter={(val: string) => { provider.prefix = val; updateProvider(); }} />
            <SettingsTextField label="Search Url" defaultValue={provider.searchUrl} setter={(val: string) => { provider.searchUrl = val; updateProvider(); }} />
            <SettingsTextField label="Base Url" defaultValue={provider.baseUrl} setter={(val: string) => { provider.baseUrl = val; updateProvider(); }} />
        </div>
    )
}
