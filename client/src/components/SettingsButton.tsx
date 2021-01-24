import { Icon } from '@iconify/react-with-api';
import React from 'react';

interface SettingsButtonProps {
    openSettings: Function;
}

export default function SettingsButton({ openSettings }: SettingsButtonProps) {
    return (
        <div className="absolute bottom-0 left-0 m-3 opacity-0 hover:opacity-100 transition-all">
            <button onClick={() => (openSettings())}>
                <Icon icon="fluent-settings-28-filled" width="60" />
            </button>
        </div>
    )
}
