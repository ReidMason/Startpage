import React, { useContext } from 'react';
import AppsGrid from "../../modules/AppsGrid";
import EnterTransition from '../../components/EnterTransition';
import GreetingText from "../../modules/GreetingText";
import SearchBar from "../../modules/SearchBar";
import SettingsButton from "../../components/SettingsButton";
import WeatherDisplay from '../../modules/WeatherDisplay';
import Timer from '../../modules/Timer';
import { GlobalContext } from './globalContext';

export default function Startpage() {
    const { config } = useContext(GlobalContext)!;

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
                </EnterTransition>
            </div>

            <SettingsButton />
        </div>
    )
}
