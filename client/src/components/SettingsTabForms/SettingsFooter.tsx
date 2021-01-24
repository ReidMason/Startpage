import React, { useContext, useState } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { GlobalContext } from '../../modules/startpage/globalContext';
import * as configService from "../../services/ConfigService";
import Button from '../Button';

interface SettingsFooterProps {
    closeModal: Function;
}

export default function SettingsFooter({ closeModal }: SettingsFooterProps) {
    const { modifiedConfig } = useContext(SettingsContext)!;
    const { config, setConfig } = useContext(GlobalContext)!;

    const [loading, setLoading] = useState<boolean>(false);

    const saveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        if (config && modifiedConfig) {
            setLoading(true);
            configService.saveConfig(modifiedConfig).then(res => {
                if (res.data)
                    setConfig({ ...modifiedConfig });
            }).finally(() => (setLoading(false)));
        }
    }

    return (
        <div className="flex gap-8 p-4 bg-nord-2 rounded-br-lg justify-end">
            <div className="w-20">
                <Button loading={loading} colour="green" onClick={saveConfig}>Save</Button>
            </div>
            <div className="w-20">
                <Button loading={loading} colour="red" onClick={closeModal}>Close</Button>
            </div>
        </div>
    )
}
