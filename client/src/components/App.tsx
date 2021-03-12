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
        <a className={`p-2 hover:shadow-lg hover:bg-nord-1 focus:shadow-lg focus:bg-nord-1 focus:outline-none rounded cursor-pointer transition`} {...preview ? {} : { href: app.url }}>
            <div className="flex" >
                <div className="mr-2 text-4xl text-nord-8">
                    <Icon icon={app.icon} />
                </div>
                <div>
                    <p className="lowercase">{app.name}</p>
                    <p className="text-xs text-nord-8">{displayUrl}</p>
                </div>
            </div>
        </a>
    )
}
