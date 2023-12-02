import React, { HTMLAttributes, Children } from "react";

export default function SettingsGroup({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const childrenArray = Children.toArray(children);

  return (
    <div
      {...props}
      className="grid grid-cols-5 rounded-lg dark:bg-gray-800 gap-2 p-2 items-center"
    >
      {childrenArray.map((child, i) => (
        <Temp key={i}>
          {child}
          {i < childrenArray.length - 1 && (
            <hr className="opacity-10 col-span-full" />
          )}
        </Temp>
      ))}
    </div>
  );
}

function Temp({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
