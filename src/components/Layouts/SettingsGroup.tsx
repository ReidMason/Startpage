import React, { HTMLAttributes, Children } from "react";

export default function SettingsGroup({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const childrenArray = Children.toArray(children);

  return (
    <div
      {...props}
      className="flex flex-col rounded-lg dark:bg-gray-800 gap-2 py-2"
    >
      {childrenArray.map((child, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="px-2">{child}</div>
          {i < childrenArray.length - 1 && <hr className="opacity-10" />}
        </div>
      ))}
    </div>
  );
}
