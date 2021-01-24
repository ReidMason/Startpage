import { Icon } from '@iconify/react-with-api';
import React from 'react';
import { IApp } from '../services/ConfigService';

interface IAppProp {
    app: IApp;
    preview?: boolean
}

export default function App({ app, preview }: IAppProp) {
    // Remove http, https and trailing slashes
    const displayUrl = app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0];


    return (
        <div className={`p-2 hover:shadow-lg hover:bg-nord-1 rounded cursor-pointer transition`}>
            <a className="flex" {...preview ? {} : { href: app.url }}>
                <div className="mr-2 text-4xl text-nord-8">
                    <Icon icon={app.icon} />
                </div>
                <div>
                    <p className="lowercase">{app.name}</p>
                    <p className="text-xs text-nord-8">{displayUrl}</p>
                </div>
            </a>
        </div >
    )
}
