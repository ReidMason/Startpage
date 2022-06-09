import { ReactNode, MouseEventHandler } from "react";
import type { Variant, Styles, State, Type } from "./types";

const styles: Styles = {
  default: {
    default:
      "text-primary-400 dark:text-primary-50 dark:bg-primary-400 bg-primary-200 hover:bg-primary-300",
    danger:
      "text-primary-400 dark:text-primary-50 bg-red-200 dark:bg-red-400 hover:bg-red-300",
    warning:
      "text-primary-400 dark:text-primary-50 bg-yellow-200 dark:bg-yellow-400 hover:bg-yellow-300",
    success:
      "text-primary-400 dark:text-primary-50 bg-green-300 dark:bg-green-500 hover:bg-green-300",
    grey: "text-primary-400 dark:text-primary-50 bg-grey-200 dark:bg-grey-400 hover:bg-grey-300",
    dark: "text-primary-50 bg-primary-600 hover:bg-primary-500",
  },
  outline: {
    default:
      "transform hover:scale-105 backdrop-blur-xl bg-primary-100/20 hover:bg-primary-100/40 text-primary-800 dark:text-primary-50",
    danger:
      "backdrop-blur-xl text-primary-800 border-red-400 hover:border-red-300 dark:text-primary-50 dark:border-red-600 hover:dark:border-red-500",
    warning:
      "backdrop-blur-xl text-primary-800 border-yellow-400 hover:border-yellow-300 dark:text-primary-50 dark:border-yellow-600 hover:dark:border-yellow-500",
    success:
      "backdrop-blur-xl text-primary-800 border-green-400 hover:border-green-300 dark:text-primary-50 dark:border-green-600 hover:dark:border-green-500",
    grey: "backdrop-blur-xl text-primary-800 border-grey-400 hover:border-grey-300 dark:text-primary-50 dark:border-grey-600 hover:dark:border-grey-500",
    dark: "backdrop-blur-xl text-primary-50 border-primary-600 hover:border-primary-500",
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
      className={`${dynamicStyles} cursor-pointer border-2 border-transparent p-1 px-4 transition duration-300 focus-visible:outline-2 focus-visible:outline-primary-50 sm:min-w-[8rem] ${className}`}
      type={buttonType}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
