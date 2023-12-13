import { classNames } from "@/utils/utils";
import type { DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  React.AriaAttributes { }

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      className={classNames(
        "rounded-full bg-primary-700 px-4 py-2 text-primary-50 dark:hover:bg-primary-600",
        className ?? "",
      )}
      {...props}
    >
      {props.children}
    </button>
  );
};
