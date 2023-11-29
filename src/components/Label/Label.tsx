import React, { HTMLAttributes } from "react";

interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  text: string;
  htmlFor: string;
}

export default function Label({ children, text, ...props }: LabelProps) {
  return (
    <div>
      <label
        {...props}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
      >
        {text}
      </label>
      {children}
    </div>
  );
}
