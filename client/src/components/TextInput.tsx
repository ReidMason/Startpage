import React, { useState } from 'react';

interface TextInputProps {
    placeholder?: string;
    defaultValue?: string | number;
    setValue: Function;
    type?: "text" | "password" | "number";
    disabled?: boolean;
    autoComplete?: string;
    className?: string;
    floatingLabel?: boolean;

}

export default function TextInput({ placeholder, defaultValue, setValue, type, disabled, autoComplete, className, floatingLabel }: TextInputProps) {
    const [localValue, setLocalValue] = useState(defaultValue);

    const inputType = type ?? "text";
    const inputDisabled = disabled ?? false
    const inputAutocomplete = autoComplete ?? "off";
    const floatingLabelStyles = floatingLabel ? "focus:placeholder-transparent" : "";

    const modified = localValue !== defaultValue;

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
        setValue(e.target.value);
    }

    //text-nord-6 p-1 border border-nord-4 border-opacity-20 focus:outline-none focus:border-nord-5 focus:border-opacity-50 rounded-md bg-nord-3

    return (
        <div className="flex flex-col-reverse gap-2">
            <input className={`${className} ${floatingLabelStyles} ${modified ? "" : "border-opacity-0"} peer z-10 text-snow-3 p-2 rounded bg-night-4 border border-night-4 disabled:cursor-not-allowed disabled:opacity-50`} type={inputType} placeholder={placeholder} disabled={inputDisabled} value={localValue} onChange={updateValue} autoComplete={inputAutocomplete} />
            <label className={`${floatingLabel ? "" : "hidden"} ml-1 text-snow-1 transition-all transform translate-y-0 opacity-100 peer-placeholder-shown:opacity-0 peer-placeholder-shown:translate-y-10 peer-focus:opacity-100 peer-focus:translate-y-0`}>{placeholder}</label>
        </div>
    )
}
