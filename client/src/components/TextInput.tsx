import React, { useEffect, useState } from 'react';

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

    // When updates are made to the default value also update the local state
    useEffect(() => {
        setLocalValue(defaultValue);

    }, [defaultValue])

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
        setValue(e.target.value);
    }

    return (
        <div className={`flex flex-col-reverse w-full ${className}`}>
            <input className={`${floatingLabelStyles} peer z-10 text-nord-0 p-2 rounded bg-nord-5 border border-nord-5 disabled:cursor-not-allowed disabled:opacity-50`} type={inputType} placeholder={placeholder} disabled={inputDisabled} value={localValue} onChange={updateValue} autoComplete={inputAutocomplete} />
            <label className={`ml-1 mb-2 text-nord-4 transition-all transform translate-y-0 opacity-100 ${floatingLabel ? "peer-placeholder-shown:opacity-0 peer-placeholder-shown:translate-y-10 peer-focus:opacity-100 peer-focus:translate-y-0" : ""}`}>{placeholder}</label>
        </div>
    )
}
