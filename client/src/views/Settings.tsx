import React, { useContext, useEffect, useState } from 'react'
import Button from '../components/Button';
import PhilipsHueSettings from '../modules/settings/PhilipsHueSettings'
import GeneralSettings from '../modules/settings/GeneralSettings';
import { SettingsContext } from '../modules/settings/settingsContext';
import { IConfiguration, saveConfig } from '../services/ConfigService';
import { GlobalContext } from './startpage/globalContext';
import AppSettings from '../modules/settings/AppSettings';
import ConfirmationModal from '../modules/ConfirmationModal';
import WeatherSettings from '../modules/settings/WeatherSettings';
import ProviderSettings from '../modules/settings/ProviderSettings';
import { useNavigate } from 'react-router-dom';

interface settingsSection {
    name: string;
    settingsPages: Array<SettingsPage>;
}

interface SettingsPage {
    name: string;
    component: Function;
}

const settingsSections: Array<settingsSection> = [
    {
        name: "",
        settingsPages: [
            { name: "General", component: GeneralSettings },
            { name: "Apps", component: AppSettings },
            { name: "Providers", component: ProviderSettings },
        ]
    },
    {
        name: "Addons",
        settingsPages: [
            { name: "PhilipsHue", component: PhilipsHueSettings },
            { name: "Weather", component: WeatherSettings }
        ]
    },
]

export default function Settings() {
    const { config, setConfig } = useContext(GlobalContext)!;
    const [modifiedConfig, setModifiedConfig] = useState<IConfiguration | null>(JSON.parse(JSON.stringify(config)));
    const [selectedTab, setSelectedTab] = useState<SettingsPage>(settingsSections[0].settingsPages[0]);
    const [unsavedWarningModalOpen, setUnsavedWarningModalOpen] = useState(false);
    const [nextTabTarget, setNextTabTarget] = useState<string>();
    const [unsavedWarningCallback, setUnsavedWarningCallback] = useState<Function>();

    const navigate = useNavigate();

    useEffect(() => {
        // When saved config is updated also update the modified config to match
        setModifiedConfig(JSON.parse(JSON.stringify(config)));
    }, [config])

    const saveConfigChanges = () => {
        if (config && modifiedConfig) {
            saveNewConfig(modifiedConfig);
        }
    }

    const saveNewConfig = (newConfig: IConfiguration) => {
        saveConfig(newConfig).then(res => {
            if (res.data)
                setConfig({ ...newConfig });
        });
    }

    const settingsModified = JSON.stringify(config) !== JSON.stringify(modifiedConfig);

    const changeSelectedTab = (tabName: string) => {
        // If settings are modified show the tab switch confirmation
        if (settingsModified) {
            setNextTabTarget(tabName);
            setUnsavedWarningModalOpen(true);
            setUnsavedWarningCallback(goToNextTabTarget);
            return;
        }

        goToNextTabTarget(tabName);
    }

    const goToNextTabTarget = (tabName?: string) => {
        const targetTabName = tabName ?? nextTabTarget;

        for (let i = 0; i < settingsSections.length; i++) {
            const settingsSection = settingsSections[i];
            const newSelectedTab = settingsSection.settingsPages.find(x => x.name === targetTabName);
            if (newSelectedTab) {
                setSelectedTab(newSelectedTab);
                resetModifiedConfig();
                return;
            }
        }

    }

    const resetModifiedConfig = () => {
        if (config)
            setModifiedConfig(JSON.parse(JSON.stringify(config)));
    }

    const goBackToStartpage = () => {
        // If settings are modified show the tab switch confirmation
        if (settingsModified) {
            setUnsavedWarningModalOpen(true);
            return;
        }

        setUnsavedWarningCallback(() => { navigate("/", { replace: true }) });
    }

    const confirmUnsavedChangesModal = () => {
        if (unsavedWarningCallback)
            unsavedWarningCallback();
    }

    return (
        <SettingsContext.Provider value={{ modifiedConfig, setModifiedConfig, saveNewConfig }}>
            <div className="flex h-screen">

                <div className="absolute md:hidden right-0 top-0 p-2">
                    <button className="text-nord-4 active:text-nord-9">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden md:flex flex-col border-r border-nord-0 bg-nord-1 pb-4 bt-16 min-w-[24rem]">
                    <h1 className="text-center text-xl text-nord-4 py-4">Settings</h1>

                    <div className="flex flex-col">
                        {settingsSections.map((section) => (
                            <div key={section.name}>
                                <h2 className="text-nord-4 text-xl py-2 pl-4">{section.name}</h2>
                                <ul className="flex flex-col">
                                    {section.settingsPages.map((page) => (
                                        <li className="border-b border-nord-0" key={page.name}>
                                            <button className={`border border-nord-4 border-opacity-0 ${page.name === selectedTab.name ? "border-opacity-100" : ""} p-2 bg-nord-3 text-nord-4 w-full hover:bg-nord-2`} onClick={() => changeSelectedTab(page.name)}>
                                                {page.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="flex flex-col w-full">
                    <div className="flex flex-col gap-2 bg-nord-1 p-3">
                        <h2 className="text-2xl text-nord-4">{selectedTab.name}</h2>
                        <div className="flex justify-between">
                            <Button disabled={!settingsModified} className="w-24" onClick={saveConfigChanges} colour="green">Save</Button>
                            <Button className="w-24" onClick={goBackToStartpage} colour="blue" >Back</Button>
                        </div>
                    </div>

                    <div className="overflow-y-auto h-full">
                        <selectedTab.component />
                    </div>
                </div>

                <ConfirmationModal isOpen={unsavedWarningModalOpen} close={() => setUnsavedWarningModalOpen(false)} title="Confirm deletion" confirmAction={confirmUnsavedChangesModal} denyAction={() => { }} >
                    <p>Are you sure you want to leave this page?</p>
                    <p>All unsaved changes will be lost.</p>
                </ConfirmationModal>
            </div>
        </SettingsContext.Provider>
    )
}
