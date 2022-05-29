import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import FormElementWrapper, {
  FormElementWrapperParentProps,
} from "../FormElement/FormElementWrapper";
import { Autocomplete, State, Variant } from "./types";

interface TextInputProps extends FormElementWrapperParentProps {
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
        className={`input ${inputState} ${inputVariant} ${pilledStyles} px-3 py-1 transition-all duration-300 focus-visible:outline-none dark:text-primary-800`}
        type={textType}
        disabled={disabled}
        placeholder={placeholder}
      />
    </FormElementWrapper>
  );
}
