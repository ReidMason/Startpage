import { Icon } from '@iconify/react-with-api';
import React from 'react';
import { IApp } from '../services/ConfigService';

interface IAppProp {
    app: IApp;
    preview?: boolean
    className?: string;
}

export default function App({ app, preview, className }: IAppProp) {
    // Remove http, https and trailing slashes
    const displayUrl = app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0];

    return (
        <a className={`flex items-center p-2 hover:shadow-lg hover:bg-nord-1 focus:shadow-lg focus:bg-nord-1 focus:outline-none rounded cursor-pointer transition ${className}`} {...preview ? {} : { href: app.url }}>
            <div className="mr-2 text-4xl text-nord-8">
                <Icon icon={app.icon || "entypo:new-message"} />
            </div>
            <div>
                <p className="text-nord-4 lowercase">{app.name || "New app"}</p>
                <p className="text-xs text-nord-8">{displayUrl || "app.example.com"}</p>
            </div>
        </a>
    )
}
