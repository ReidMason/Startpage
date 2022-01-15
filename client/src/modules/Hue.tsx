import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../views/startpage/globalContext';
import { getGroups, HueGroup, toggleGroup } from '../services/HueService';

export default function Hue() {
    const { config } = useContext(GlobalContext)!;
    const [group, setGroup] = useState<HueGroup>();

    const updateGroupData = useCallback(
        () => {
            getGroups().then(response => {
                const groupData = response.data.find(x => x.id === config?.philipsHue.selectedGroupId);
                setGroup(groupData);
            })
        },
        [config?.philipsHue.selectedGroupId],
    )

    useEffect(() => {
        updateGroupData();
    }, [updateGroupData])

    const toggleLightGroup = () => {
        toggleGroup(config!.philipsHue.selectedGroupId).then(response => {
            group!.any_on = response.data.lightOn;
            setGroup({ ...group! });
        })
    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center cursor-pointer" onClick={toggleLightGroup}>
            <div className={`transition-all ${group?.any_on ? "text-nord-8" : "text-nord-4 opacity-50"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
            </div>
            <span>{group?.name}</span>
        </div >
    )
}
