import React, { useContext, useState } from 'react';
import AppsGrid from "../../modules/AppsGrid";
import EnterTransition from '../../components/EnterTransition';
import GreetingText from "../../modules/GreetingText";
import SearchBar from "../../modules/SearchBar";
import SettingsButton from "../../components/SettingsButton";
import WeatherDisplay from '../../modules/WeatherDisplay';
import { GlobalContext } from './globalContext';
import { startpageContext } from './startpageContext';
import IStartpageContext from '../../interfaces/StartpageContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';


const classNames = {
    enter: 'transition duration-150 scale-0 opacity-40 origin-bottom',
    enterActive: 'transition duration-150 scale-100 opacity-100 origin-bottom',
    enterDone: '',
    exit: 'transition duration-150 opacity-0 transform -translate-y-3',
}

export default function Startpage() {
    const { config } = useContext(GlobalContext)!;
    const [startpageCont, setStartpageCont] = useState<IStartpageContext>({ modules: [] });

    const removeModule = (moduleId: string) => {
        startpageCont.modules = startpageCont.modules.filter(x => x.id !== moduleId);
        setStartpageCont({ ...startpageCont });
    }

    return (
        <startpageContext.Provider value={{ startpageCont, setStartpageCont }}>
            <div className="container mx-auto text-white mt-28 mb-8">
                <div className="w-10/12 max-w-screen-xl px-4 mx-auto md:w-5/6 lg:w-full">
                    <EnterTransition>
                        <div className="mb-10">
                            <SearchBar />
                        </div>

                        {config &&
                            <div className="mb-4 md:flex">
                                <GreetingText calendarUrl={config.general.calendarUrl} />
                                <div className="ml-auto">
                                    {config.weather.enabled &&
                                        <WeatherDisplay />
                                    }
                                </div>
                            </div>}

                        <AppsGrid />

                        <TransitionGroup component="div" className="mt-24 flex flex-wrap gap-4">
                            {startpageCont.modules.map((module) => (
                                <CSSTransition timeout={150} classNames={classNames} key={module.id} >
                                    <div className="group hover:bg-nord-1 p-3 rounded relative overflow-hidden hover:shadow-md">
                                        <button className="transition-all absolute opacity-0 p-0.5 group-hover:opacity-100 top-0 right-0 rounded-bl-md text-nord-4 bg-nord-11 shadow-sm hover:scale-125 hover:-translate-x-0.5 hover:translate-y-0.5" onClick={() => removeModule(module.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <module.element />
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </EnterTransition>
                </div>

                <SettingsButton />
            </div>
        </startpageContext.Provider>
    )
}
