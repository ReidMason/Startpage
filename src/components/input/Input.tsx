import { ChangeEvent, ChangeEventHandler, useRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { StateSetter } from "../../../types/common";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface InputProps {
  value?: string;
  onChange?: StateSetter<string>;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  clearable?: boolean;
}

export default function Input({
  onChange,
  value,
  register,
  placeholder,
  clearable,
}: InputProps) {
  const inputElement = useRef<HTMLInputElement>();

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
