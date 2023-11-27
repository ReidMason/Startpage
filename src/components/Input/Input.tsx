import React, { HTMLAttributes } from "react";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: (newValue: string) => void;
  name: string;
  label: string;
}

export default function Input({
  value,
  setValue,
  label,
  ...props
}: InputProps) {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
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
          value={value}
          onChange={handleChange}
          {...props}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
