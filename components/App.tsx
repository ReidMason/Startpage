import { Icon } from '@iconify/react-with-api';
import React from 'react';
import { App as AppInterface } from '../interfaces/Config';

interface AppProps {
    app: AppInterface;
    preview?: boolean
    className?: string;
}

export default function App({ app, preview, className }: AppProps) {
    // Remove http, https and trailing slashes
    const displayUrl = app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0];

    return (
        <a className={`flex items-center p-2 text-nord-4 border border-opacity-0 border-nord-3 rounded cursor-pointer transition hover:shadow-lg hover:bg-nord-1 focus:shadow-lg hover:border-opacity-80 focus:bg-nord-1 focus:outline-none ${className}`} {...preview ? {} : { href: app.url }}>
            <div className="mr-2 text-4xl text-nord-8">
                <Icon icon={app.icon || "entypo:new-message"} />
            </div>
            <div>
                <p className="text-white lowercase">{app.name || "New app"}</p>
                <p className="text-xs text-nord-8">{displayUrl || "app.example.com"}</p>
            </div>
        </a>
    )
}
