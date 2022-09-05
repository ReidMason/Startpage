import type { ChangeEvent, ChangeEventHandler } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { StateSetter } from "../../../types/common";

interface InputProps {
  value?: string;
  onChange?: StateSetter<string>;
  register?: UseFormRegisterReturn;
  placeholder?: string;
}

export default function Input({
  onChange,
  value,
  register,
  placeholder,
}: InputProps) {
  const lightClasses = "bg-primary-100 glassy:bg-primary-100/40";
  const darkClasses =
    "dark:bg-primary-600 dark:glassy:bg-primary-100/40 focus:dark:glassy:bg-primary-100/60";

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      className={`w-full rounded-lg py-1.5 px-3 transition duration-75 focus:outline-none ${lightClasses} ${darkClasses}`}
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      {...register}
    />
  );
}
