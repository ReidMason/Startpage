import { ChangeEvent, ChangeEventHandler, useRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { StateSetter } from "../../../types/common";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface InputProps {
  value?: string;
  onChange?: StateSetter<string>;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  clearable?: boolean;
  autocomplete?: Boolean;
}

export default function Input({
  onChange,
  value,
  register,
  placeholder,
  clearable,
  autocomplete,
}: InputProps) {
  const inputElement = useRef<HTMLInputElement>(null);

  const lightClasses = "bg-primary-100 glassy:bg-primary-100/40";
  const darkClasses =
    "dark:bg-primary-600 dark:glassy:bg-primary-100/40 focus-within:dark:glassy:bg-primary-100/60";

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const clearInput = () => {
    if (onChange) onChange("");
    inputElement.current?.focus();
  };

  const inputAutocomplete = autocomplete ? "on" : "off";

  return (
    <div
      className={`flex w-full rounded-lg py-1.5 px-3 transition duration-75 ${lightClasses} ${darkClasses}`}
    >
      <input
        ref={inputElement}
        className="w-full bg-transparent focus:outline-none"
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        autoComplete={inputAutocomplete}
        {...register}
      />

      {clearable && value !== "" && (
        <button onClick={clearInput}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
