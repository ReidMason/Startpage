import { classNames } from "@/utils/utils";
import React, { HTMLAttributes } from "react";

interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  text: string;
  htmlFor: string;
}

export default function Label({ children, text, ...props }: LabelProps) {
  return (
    <>
      <label
        {...props}
        className={classNames(
          "block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50 col-span-2",
          props.className ?? "",
        )}
      >
        {text}
      </label>
      <div className="flex justify-end col-span-3">{children}</div>
    </>
  );
}
