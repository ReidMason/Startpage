import React, { HTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  value?: string;
  setValue?: (newValue: string) => void;
  name: string;
  label?: string;
  register?: UseFormRegisterReturn;
}

export default function Input({
  value,
  setValue,
  label,
  register,
  ...props
}: InputProps) {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (setValue) setValue(e.currentTarget.value);
  };

  return (
    <div>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          autoComplete="off"
          {...props}
          value={value}
          onChange={handleChange}
          {...register}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
