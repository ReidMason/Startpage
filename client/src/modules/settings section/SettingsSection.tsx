import React, { useContext, useState } from 'react';
import Modal from "../../components/Modal";
import AppSettings from '../../components/SettingsTabForms/AppSettings';
import GeneralSettings from '../../components/SettingsTabForms/GeneralSettings';
import Header from '../../components/SettingsTabForms/Header';
import ProvidersSettings from '../../components/SettingsTabForms/ProvidersSettings';
import SettingsFooter from '../../components/SettingsTabForms/SettingsFooter';
import WeatherSettings from '../../components/SettingsTabForms/WeatherSettings';
import SettingsTabs from '../../components/SettingsTabs';
import * as configService from "../../services/ConfigService";
import { GlobalContext } from '../startpage/globalContext';
import { SettingsContext } from './settingsContext';

interface SettingsProps {
    closeModal: Function;
}

export default function SettingsSection({ closeModal }: SettingsProps) {
    const { config } = useContext(GlobalContext)!;
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [modifiedConfig, setModifiedConfig] = useState<configService.IConfiguration | null>(JSON.parse(JSON.stringify(config)));

    const settingsTabs = [
        {
            name: "General",
            icon: "clarity-settings-solid"
        },
        {
            name: "Apps",
            icon: "bi-bookmark-fill"
        },
        {
            name: "Providers",
            icon: "bi-search"
        },
        {
            name: "Weather",
            icon: "ph-cloud-sun-fill"
        }
    ]

    return (
        <SettingsContext.Provider value={{ modifiedConfig, setModifiedConfig }}>
            <Modal
                sidebar={<SettingsTabs settingsTabs={settingsTabs} selectedTab={selectedTab} setSelectedTab={(tabIndex: number) => (setSelectedTab(tabIndex))} />}
                header={<Header title={settingsTabs[selectedTab].name} />}
                footer={<SettingsFooter closeModal={closeModal} />} >
                <div className="p-4">
                    {selectedTab === 0 && <GeneralSettings />}
                    {selectedTab === 1 && <AppSettings />}
                    {selectedTab === 2 && <ProvidersSettings />}
                    {selectedTab === 3 && <WeatherSettings />}
                </div>
            </Modal>
        </SettingsContext.Provider>
    )
}
