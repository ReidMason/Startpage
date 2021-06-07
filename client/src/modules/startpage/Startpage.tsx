import React, { useEffect, useState } from 'react';
import AppsGrid from "../../components/AppsGrid";
import EnterTransition from '../../components/EnterTransition';
import GreetingText from "../../components/GreetingText";
import SearchBar from "../../components/SearchBar";
import SettingsButton from "../../components/SettingsButton";
import WeatherDisplay from '../../components/WeatherDisplay';
import * as configService from "../../services/ConfigService";
import SettingsSection from "../settings section/SettingsSection";
import { GlobalContext } from "./globalContext";

export default function Startpage() {
    const [config, setConfig] = useState<configService.IConfiguration | null>(null);
    const [settingsVisible, setsettingsVisible] = useState<boolean>(false);

    useEffect(() => {
        // Load the config
        configService.getConfig().then((response) => {
            setConfig(response.data);
        });
    }, []);

    return (
        <GlobalContext.Provider value={{ config, setConfig }}>
            <div className="container mx-auto text-white mt-28">
                <div className="w-10/12 max-w-screen-xl px-4 mx-auto md:w-5/6 lg:w-full">
                    <EnterTransition>
                        <div className="mb-10">
                            <SearchBar />
                        </div>

                        {config && <div className="mb-4 md:flex">
                            <GreetingText calendarUrl={config.general.calendarUrl} />
                            <div className="ml-auto">
                                {config.weather.enabled &&
                                    <WeatherDisplay />
                                }
                            </div>
                        </div>}

                        <AppsGrid />
                    </EnterTransition>
                </div>

                {settingsVisible && <SettingsSection closeModal={() => (setsettingsVisible(false))} />}

                <SettingsButton openSettings={() => (setsettingsVisible(true))} />
            </div>
        </GlobalContext.Provider>
    )
}
