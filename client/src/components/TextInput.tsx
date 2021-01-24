import React, { useState } from 'react';

interface TextInputProps {
    defaultValue: string;
    setter: Function;
    disabled?: boolean;
}

export default function TextInput({ defaultValue, setter, disabled }: TextInputProps) {
    const [value, setvalue] = useState(defaultValue);

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setvalue(e.target.value);
        setter(e.target.value);
    }

    const modified = value !== defaultValue;

    return (
        <div className={`w-full border-2 border-nord-7 ${modified ? "" : "border-opacity-0"} rounded-lg`}>
            <input disabled={disabled} className="w-full text-nord-6 rounded p-1 border border-nord-4 border-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-nord-5 focus:border-opacity-50 rounded-md bg-nord-3 w-64" type="text" defaultValue={defaultValue} onChange={updateValue} />
        </div>
    )
}
