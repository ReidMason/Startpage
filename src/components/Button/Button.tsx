import type { DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className="rounded-full text-primary-50 px-4 py-2 bg-primary-700"
      {...props}
    >
      {props.children}
    </button>
  );
};
