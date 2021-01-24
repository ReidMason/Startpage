import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { generateUuid } from '../../utils';
import App from '../App';
import Button from '../Button';
import AppForm from './AppForm';


export default function AppSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const removeApp = (appId: string) => {
        modifiedConfig!.apps = modifiedConfig!.apps.filter((app) => (app.id !== appId))
        setModifiedConfig({ ...modifiedConfig! });
    }

    const createNewApp = () => {
        modifiedConfig!.apps.push({ id: generateUuid(), name: "", url: "", icon: "" });
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {modifiedConfig!.apps.map((app) => (
                <div className="border border-nord-4 border-opacity-40 rounded p-2 lg:grid lg:grid-cols-3 lg:gap-8" key={app.id}>
                    <div className="col-span-2">
                        <AppForm app={app} />
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="my-auto">
                            <App app={app} preview />
                        </div>
                        <div className="flex justify-end">
                            <div className="mt-auto w-24">
                                <Button onClick={() => (removeApp(app.id))} colour="red">Delete</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
            <div className="w-24">
                <Button onClick={createNewApp} colour="green">New app</Button>
            </div>
        </div >
    )
}
