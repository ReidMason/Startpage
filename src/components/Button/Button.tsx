import { classNames } from "@/utils/utils";
import type { DetailedHTMLProps } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps
  extends DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  React.AriaAttributes {
  loading?: boolean;
}

export const Button = ({ className, loading, ...props }: ButtonProps) => {
  return (
    <button
      className={classNames(
        "flex items-center justify-center rounded-full bg-primary-700 px-4 py-2 text-primary-50 disabled:cursor-not-allowed disabled:opacity-50 enabled:dark:hover:bg-primary-600",
        className ?? "",
      )}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {props.children}
    </button>
  );
};
