import React from 'react';
import TextInput from './TextInput';

interface SettingsTextFieldProps {
    defaultValue: string;
    setter: Function;
    label: string;
    disabled?: boolean;
}

export default function SettingsTextField({ label, setter, defaultValue, disabled }: SettingsTextFieldProps) {
    return (
        <div className="grid grid-cols-8">
            <p className="flex col-span-1 items-center text-nord-4 pl-8">{label}</p>
            <div className="col-span-7">
                <TextInput disabled={disabled} defaultValue={defaultValue} setValue={setter} />
            </div>
        </div>
    )
}
