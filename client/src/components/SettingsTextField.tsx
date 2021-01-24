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
        <div className="grid grid-cols-4">
            <p className="col-span-1 my-auto">{label}</p>
            <div className="col-span-3">
                <TextInput disabled={disabled} defaultValue={defaultValue} setter={setter} />
            </div>
        </div>
    )
}
