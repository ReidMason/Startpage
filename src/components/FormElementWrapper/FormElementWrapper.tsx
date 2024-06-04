import type { ReactNode } from "react";

interface FormElementWrapperProps {
  children: ReactNode;
  label?: String;
}

export default function FormElementWrapper({
  children,
  label,
}: FormElementWrapperProps) {
  return (
    <div className="grid grid-cols-12 gap-x-2">
      <p className="col-span-5 flex items-center">{label}</p>
      <div className="col-span-7 flex w-full justify-end">{children}</div>
    </div>
  );
}
