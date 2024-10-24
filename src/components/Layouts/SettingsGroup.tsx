import React, { HTMLAttributes, Children } from "react";

export default function SettingsGroup({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const childrenArray = Children.toArray(children);

  return (
    <div
      {...props}
      className="grid grid-cols-5 items-center gap-2 rounded-lg p-2"
    >
      {childrenArray.map((child, i) => (
        <Temp key={i}>
          {child}
          {i < childrenArray.length - 1 && (
            <hr className="col-span-full opacity-10" />
          )}
        </Temp>
      ))}
    </div>
  );
}

function Temp({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
