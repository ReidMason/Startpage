import React from 'react';
import { App as AppInterface, Config } from '../../../../interfaces/Config';
import App from '../../../App';
import Button from '../../../Button';
import TextInput from '../../../Input';
import IconSearch from '../../IconSearch';

interface AppFormProps {
    config: Config;
    modifiedConfig: Config;
    setModifiedConfig: Function;
    app: AppInterface;
    editEnabled: boolean;
    enableEditing: Function;
}

export default function AppForm({ config, modifiedConfig, setModifiedConfig, app, editEnabled, enableEditing }: AppFormProps) {
    const savedApp = config.apps.find(x => x.id === app.id);
    const modified = JSON.stringify(app) != JSON.stringify(savedApp);

    const updateApp = (updatedApp: any) => {
        modifiedConfig.apps = modifiedConfig.apps.map((originalApp) => (originalApp.id === app.id ? { ...app, ...updatedApp } : originalApp));
        setModifiedConfig({ ...modifiedConfig! });
    }

    const removeApp = () => {
        modifiedConfig.apps = modifiedConfig.apps.filter((x) => (x.id !== app.id));
        setModifiedConfig({ ...modifiedConfig });
    }

    const resetApp = () => {
        modifiedConfig.apps = modifiedConfig.apps.map((x) => (x.id === savedApp.id ? savedApp : x));

        setModifiedConfig({ ...modifiedConfig });
    }

    const iconSelected = (iconName: string) => {
        updateApp({ icon: iconName });
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col md:self-start gap-4 border border-nord-4 border-opacity-40 rounded p-2">
                <div className="flex flex-col md:flex-row flex-wrap">
                    <div className="min-w-[16rem] max-w-[16rem] overflow-hidden">
                        <App app={app} preview />
                    </div>

                    <div className={`${editEnabled ? "" : "hidden"} md:flex flex-wrap gap-2`}>
                        <TextInput className="w-full md:w-64" placeholder="Name" defaultValue={app.name} setValue={(val: string) => { updateApp({ name: val }); }} floatingLabel />
                        <TextInput className="w-full md:w-96" placeholder="Url" defaultValue={app.url} setValue={(val: string) => { updateApp({ url: val }) }} floatingLabel />
                        <TextInput className="w-full lg:w-64" placeholder="Icon" defaultValue={app.icon} setValue={(val: string) => { updateApp({ icon: val }); }} floatingLabel />
                        <IconSearch className="w-full" iconSelected={iconSelected} selectedIcon={app.icon} />
                    </div>
                </div>

                {/* <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                </div> */}
                <div className="flex gap-4">
                    <div className="md:hidden">
                        {
                            editEnabled ?
                                <Button colour="green" className="w-18" onClick={() => enableEditing("")}>Close</Button>
                                :
                                <Button colour="green" className="w-120" onClick={() => enableEditing(app.id)}>Edit</Button>
                        }
                    </div>

                    <Button className="w-20" onClick={removeApp} colour="red">Delete</Button>
                    <Button className="w-20" onClick={resetApp} disabled={!modified}>Reset</Button>
                </div>
            </div>

        </div>
    )
}
