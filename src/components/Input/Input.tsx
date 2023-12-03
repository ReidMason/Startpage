import { classNames } from "@/utils/utils";
import React, { HTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  value?: string;
  setValue?: (newValue: string) => void;
  register?: UseFormRegisterReturn;
}

export default function Input({
  value,
  setValue,
  register,
  ...props
}: InputProps) {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (setValue) setValue(e.currentTarget.value);
  };

  return (
    <input
      autoComplete="off"
      {...props}
      value={value}
      onChange={handleChange}
      {...register}
      className={classNames(
        "block w-full text-gray-800 bg-white rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        props.className ?? "",
      )}
    />
  );
}
