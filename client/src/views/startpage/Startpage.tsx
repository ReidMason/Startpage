import React, { useContext, useState } from 'react';
import AppsGrid from "../../components/AppsGrid";
import EnterTransition from '../../components/EnterTransition';
import GreetingText from "../../components/GreetingText";
import SearchBar from "../../components/SearchBar";
import SettingsButton from "../../components/SettingsButton";
import WeatherDisplay from '../../components/WeatherDisplay';
import SettingsSection from "../../modules/settings section/SettingsSection";
import Timer from '../../modules/Timer';
import { GlobalContext } from './globalContext';

export default function Startpage() {
    const { config } = useContext(GlobalContext)!;
    const [settingsVisible, setsettingsVisible] = useState<boolean>(false);

    return (
        <div className="container mx-auto text-white mt-28 mb-8">
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
                    <div className="mt-24">
                        <Timer />
                    </div>

                    {/* <div className="mt-4">
                            <IconSearch />
                        </div> */}
                </EnterTransition>
            </div>

            {settingsVisible && <SettingsSection closeModal={() => (setsettingsVisible(false))} />}

            <SettingsButton openSettings={() => (setsettingsVisible(true))} />
        </div>
    )
}
