import { ReactNode, MouseEventHandler } from "react";
import type { Variant, Styles, State, Type } from "./types";

const styles: Styles = {
  default: {
    default: "text-primary-50 bg-primary-400 hover:bg-primary-300",
    danger: "text-primary-50 bg-red-400 hover:bg-red-300",
    warning: "text-primary-50 bg-yellow-400 hover:bg-yellow-300",
    success: "text-primary-50 bg-green-400 hover:bg-green-300",
    grey: "text-primary-50 bg-grey-400 hover:bg-primary-300",
    dark: "text-primary-50 bg-primary-600 hover:bg-primary-500",
  },
  outline: {
    default:
      "text-primary-800 border-primary-400 hover:border-primary-300 dark:text-primary-50 dark:border-primary-600 hover:dark:border-primary-500",
    danger:
      "text-primary-800 border-red-400 hover:border-red-300 dark:text-primary-50 dark:border-red-600 hover:dark:border-red-500",
    warning:
      "text-primary-800 border-yellow-400 hover:border-yellow-300 dark:text-primary-50 dark:border-yellow-600 hover:dark:border-yellow-500",
    success:
      "text-primary-800 border-green-400 hover:border-green-300 dark:text-primary-50 dark:border-green-600 hover:dark:border-green-500",
    grey: "text-primary-800 border-grey-400 hover:border-grey-300 dark:text-primary-50 dark:border-grey-600 hover:dark:border-grey-500",
    dark: "text-primary-50 border-primary-600 hover:border-primary-500",
  },
  ghost: {
    default: "text-primary-800 dark:text-primary-50",
    danger: "text-red-100 dark:text-red-400",
    warning: "text-yellow-100 dark:text-yellow-50",
    success: "text-green-100 dark:text-green-50",
    grey: "text-grey-100 dark:text-grey-50",
    dark: "text-primary-800",
  },
};

interface ButtonInputProps {
  children?: ReactNode;
  type?: Type;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  state?: State;
  variant?: Variant;
  pilled?: boolean;
  disabled?: boolean;
}

export default function Button({
  type,
  children,
  className,
  onClick,
  state,
  variant,
  pilled,
  disabled,
}: ButtonInputProps) {
  const buttonType: Type = type ?? "button";

  const pilledStyles = pilled ? "rounded-full px-3" : "rounded-lg";
  const styleClasses = styles[variant ?? "default"][state ?? "default"];

  const dynamicStyles = `${pilledStyles} ${styleClasses}`;

  return (
    <button
      onClick={onClick}
      className={`${dynamicStyles} min-w-[8rem] border-2 border-transparent p-1 px-4 transition duration-300 ${className}`}
      type={buttonType}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
