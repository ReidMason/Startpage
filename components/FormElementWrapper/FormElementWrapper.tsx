import React from "react";
import { State, StateStyles, Styles } from "../button/types";

export interface FormElementProps {
  label?: string;
  helperText?: string;
  noHelperText?: boolean;
  noLabel?: boolean;
  className?: string;
}

interface FormElementWrapperProps extends FormElementProps {
  children: React.ReactNode;
  htmlFor?: string;
  state?: State;
}

const stateStyles: StateStyles = {
  danger: "text-red-500",
  dark: "",
  default: "",
  grey: "",
  success: "",
  warning: "",
};

export default function FormElementWrapper({
  label,
  children,
  className,
  htmlFor,
  helperText,
  noHelperText,
  noLabel,
  state,
}: FormElementWrapperProps) {
  const stateClasses = stateStyles[state ?? "default"];

  return (
    <div className={`${className} flex flex-col justify-end gap-2`}>
      {!noLabel && label && (
        <label
          className="mb-2 h-4 text-lg text-primary-800 dark:text-primary-50"
          htmlFor={htmlFor}
        >
          {label}
        </label>
      )}
      {children}
      {!noHelperText && (
        <small
          className={`${stateClasses} h-4 transform text-sm duration-300 ${
            helperText ? "" : "opacity-0"
          }`}
        >
          {helperText}
        </small>
      )}
    </div>
  );
}