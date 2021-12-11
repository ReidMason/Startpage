import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { IApp } from '../../services/ConfigService';
import SettingsTextField from '../SettingsTextField';

interface AppFormProps {
    app: IApp;
}

export default function AppForm({ app }: AppFormProps) {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const updateApp = () => {
        modifiedConfig!.apps = modifiedConfig!.apps.map((originalApp) => (originalApp.id === app.id ? app : originalApp));
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div className="grid grid-cols-1 gap-y-2">
            <SettingsTextField label="Name" defaultValue={app.name} setter={(val: string) => { app.name = val; updateApp(); }} />
            <SettingsTextField label="Icon" defaultValue={app.icon} setter={(val: string) => { app.icon = val; updateApp(); }} />
            <SettingsTextField label="Url" defaultValue={app.url} setter={(val: string) => { app.url = val; updateApp(); }} />
        </div>
    )
}
