import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import FormElementWrapper, {
  FormElementProps,
} from "../FormElementWrapper/FormElementWrapper";
import { Autocomplete, State, Variant } from "./types";

interface TextInputProps extends FormElementProps {
  type?: HTMLInputTypeAttribute;
  state?: State;
  autoComplete?: Autocomplete;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  value?: string;
  pilled?: boolean;
  variant?: Variant;
  onChange?: ChangeEventHandler<HTMLInputElement>;
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
  className,
  noLabel,
  noHelperText,
}: TextInputProps) {
  const textType = type ?? "text";

  const pilledStyles = pilled ? "rounded-full px-5" : "rounded-lg";
  const inputState = `state-${state ?? "default"}`;
  const inputVariant = `variant-${variant ?? "default"}`;

  return (
    <FormElementWrapper
      className={className}
      htmlFor={register?.name}
      label={label}
      helperText={helperText}
      noLabel={noLabel}
      noHelperText={noHelperText}
    >
      <input
        onInput={onChange}
        value={value}
        autoComplete={autoComplete || "off"}
        {...register}
        className={`input ${inputState} ${inputVariant} ${pilledStyles} bg-primary-100/40 py-1.5 px-3 backdrop-blur transition duration-300 focus:bg-primary-100/60 focus:outline-none dark:text-primary-50`}
        type={textType}
        disabled={disabled}
        placeholder={placeholder}
      />
    </FormElementWrapper>
  );
}
