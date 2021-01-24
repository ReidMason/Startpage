import React from 'react';

interface SettingsTab {
    name: string;
    icon: string;
}

interface settingsTabsProps {
    settingsTabs: Array<SettingsTab>;
    setSelectedTab: Function;
    selectedTab: number;
}

export default function SettingsTabs({ settingsTabs, selectedTab, setSelectedTab }: settingsTabsProps) {
    const getBorders = (tabIndex: Number): string => {
        // only put a bottom border on the first element
        if (tabIndex === 0)
            return "border-b"

        // Only put a top border on the last element
        if (tabIndex === settingsTabs.length - 1)
            return "border-t"

        // Top and bottom borders on the rest
        return "border-t border-b"
    }

    const getSelctedStyling = (tabIndex: number): string => {
        let styling = selectedTab === tabIndex ? "bg-nord-1" : "border-r";
        if (tabIndex === 0)
            styling += " rounded-tl-lg";

        // if (tabIndex === settingsTabs.length - 1)
        //     styling += " rounded-bl-lg";

        return styling;
    }

    return (
        <div className="h-full overflow-hidden">
            {settingsTabs.map((tab, index) => (
                <div className={`hover:bg-nord-1 ${getSelctedStyling(index)} border-nord-4 border-opacity-20`} key={tab.name + index}>
                    <div className={`p-3 ${getBorders(index)} ${selectedTab === index ? "border-nord-4 border-opacity-20" : "border-transparent"}`} onClick={() => (setSelectedTab(index))}>
                        <span className="iconify text-4xl text-nord-8" data-icon={tab.icon}></span>
                        <h1 className="hidden">{tab.name}</h1>
                    </div>
                </div>
            ))}

            {/* Padding out the rest of the sidebar */}
            <div className="h-full border-r border-nord-4 border-opacity-20"></div>
        </div>
    )
}
