import { Icon } from '@iconify/react-with-api';
import React, { useContext, useState } from 'react';
import Hue from '../modules/Hue';
import Timer from '../modules/Timer';
import { generateUuid } from '../utils';
import { GlobalContext } from '../views/startpage/globalContext';
import { startpageContext } from '../views/startpage/startpageContext';

interface SettingsElement {
    name: string;
    icon: string;
    visible: boolean;
    function?: Function;
    path?: string;
    customClass?: string;
}

export default function SettingsButton() {
    const { config } = useContext(GlobalContext)!;
    const { startpageCont, setStartpageCont } = useContext(startpageContext)!;
    const [settingsShown, setSettingsShown] = useState(false);

    const AddNewModule = (reactComponent: Function) => {
        startpageCont.modules.push({ id: generateUuid(), element: reactComponent })
        setStartpageCont({ ...startpageCont });
    }

    const settingsButtons: Array<SettingsElement> = [
        {
            name: "Hue",
            icon: "simple-icons:philipshue",
            visible: config!.philipsHue.enabled,
            function: () => AddNewModule(Hue)
        },
        {
            name: "Timer",
            icon: "fluent:clock-alarm-24-filled",
            visible: true,
            function: () => AddNewModule(Timer)
        },
        {
            name: "Settings",
            icon: "fluent-settings-28-filled",
            visible: true,
            path: "/settings",
            customClass: `transition-transform ${settingsShown ? "rotate-180" : ""} duration-700`
        }
    ]

    return (
        <div onMouseEnter={() => setSettingsShown(true)} onMouseLeave={() => setSettingsShown(false)} className="absolute bottom-0 left-0 py-4 px-2 m-3 origin-bottom hover:!scale-y-100 opacity-0 hover:opacity-100 hover:bg-nord-2/60 rounded-lg transition-all hover:shadow-md" style={{ "transform": `scaleY(${1 / 3})` }}>
            <div className="transition-transform flex flex-col gap-4 origin-bottom scale-25 group-hover:scale-100 duration-300">
                {settingsButtons.filter(x => x.visible).map((settingsButton) => (
                    <div className="transition-all duration-75 hover:text-nord-8 cursor-pointer" key={settingsButton.name}>
                        <div className={settingsButton.customClass}>
                            {
                                settingsButton.function ?
                                    <button className="transition-all duration-75 hover:text-nord-8 active:scale-75" onClick={() => (settingsButton.function && settingsButton.function())}>
                                        <Icon icon={settingsButton.icon} width="60" />
                                    </button>
                                    :
                                    <a className="transition-all duration-75 hover:text-nord-8" href={settingsButton.path}>
                                        <Icon icon={settingsButton.icon} width="60" />
                                    </a>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
