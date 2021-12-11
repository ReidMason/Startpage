import { Icon } from '@iconify/react-with-api';
import React from 'react';

export default function SettingsButton() {
    return (
        <div className="absolute bottom-0 left-0 m-3 opacity-0 hover:opacity-100 transition-all">
            <a href="/settings" aria-label="settings-button">
                <Icon icon="fluent-settings-28-filled" width="60" />
            </a>
        </div>
    )
}
