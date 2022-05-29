import React from "react";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export default function Grid({ children, className }: GridProps) {
  return (
    <div className={`grid w-full grid-cols-12 gap-4 ${className ?? ""}`}>
      {children}
    </div>
  );
}
