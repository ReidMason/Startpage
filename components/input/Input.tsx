import React, { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Autocomplete, State, Variant } from "./types";

interface TextInputProps {
  type?: HTMLInputTypeAttribute;
  state?: State;
  autoComplete?: Autocomplete;
  register?: UseFormRegisterReturn;
  helperText?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  pilled?: boolean;
  variant?: Variant;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export default function Input({
  type,
  autoComplete,
  register,
  label,
  helperText,
  placeholder,
  state,
  onChange,
  value,
  pilled,
  variant,
  disabled,
}: TextInputProps) {
  const textType = type ?? "text";

  const pilledStyles = pilled ? "rounded-full px-5" : "rounded-lg";
  const inputState = `state-${state ?? "default"}`;
  const inputVariant = `variant-${variant ?? "default"}`;

  return (
    <div className="flex flex-col dark:text-primary-800">
      {label && (
        <label className="dark:text-primary-50" htmlFor={register?.name}>
          {label}
        </label>
      )}
      <input
        onInput={onChange}
        value={value}
        autoComplete={autoComplete || "off"}
        {...register}
        className={`input ${inputState} ${inputVariant} ${pilledStyles} px-3 py-1 transition-all duration-300 focus-visible:outline-none`}
        type={textType}
        disabled={disabled}
        placeholder={placeholder}
      />
      <p
        className={`h-4 transform duration-300 ${
          helperText ? "" : "opacity-0"
        }`}
      >
        {helperText}
      </p>
    </div>
  );
}
