import React from "react";

export interface FormElementWrapperParentProps {
  label?: string;
  helperText?: string;
  noHelperText?: boolean;
  noLabel?: boolean;
  className?: string;
}

interface FormElementWrapperProps extends FormElementWrapperParentProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export default function FormElementWrapper({
  label,
  children,
  className,
  htmlFor,
  helperText,
  noHelperText,
  noLabel,
}: FormElementWrapperProps) {
  return (
    <div className={`${className} flex flex-col justify-end gap-2`}>
      {!noLabel && label && (
        <label
          className="text-primary-800 dark:text-primary-50"
          htmlFor={htmlFor}
        >
          {label}
        </label>
      )}
      {children}
      {!noHelperText && (
        <p
          className={`h-4 transform duration-300 ${
            helperText ? "" : "opacity-0"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
