import React, { useContext } from 'react';
import IconSearch from '../modules/IconSearch';
import { SettingsContext } from '../modules/settings/settingsContext';
import { IApp } from '../services/ConfigService';
import App from './App';
import Button from './Button';
import TextInput from './TextInput';

interface AppFormProps {
    app: IApp;
}

export default function AppForm({ app }: AppFormProps) {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const updateApp = (updatedApp: any) => {
        modifiedConfig!.apps = modifiedConfig!.apps.map((originalApp) => (originalApp.id === app.id ? { ...app, ...updatedApp } : originalApp));
        setModifiedConfig({ ...modifiedConfig! });
    }

    const removeApp = () => {
        modifiedConfig!.apps = modifiedConfig!.apps.filter((savedApp) => (savedApp.id !== app.id))
        setModifiedConfig({ ...modifiedConfig! });
    }

    const iconSelected = (iconName: string) => {
        updateApp({ icon: iconName });
    }

    //flex border border-nord-4 bg-nord-1 border-opacity-40 rounded p-2 gap-8 mt-4
    return (
        <div className="grid grid-cols-3 gap-2 border border-nord-4 rounded p-2">
            <App className="col-span-3" app={app} preview />

            <TextInput className="col-span-1" placeholder="Name" defaultValue={app.name} setValue={(val: string) => { updateApp({ name: val }); }} floatingLabel />
            <TextInput className="col-span-2" placeholder="Url" defaultValue={app.url} setValue={(val: string) => { updateApp({ url: val }) }} floatingLabel />
            <TextInput className="col-span-1" placeholder="Icon" defaultValue={app.icon} setValue={(val: string) => { updateApp({ icon: val }); }} floatingLabel />
            <IconSearch className="col-span-3 row-span-5" iconSelected={iconSelected} selectedIcon={app.icon} />

            <div className="flex items-end col-start-3 row-start-3 justify-end">
                <Button className="h-11" onClick={removeApp} colour="red">Delete</Button>
            </div>
        </div>
    )
}
