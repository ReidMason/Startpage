import React from "react";

interface ButtonProps {
  children: React.ReactNode;
}

export const Button = ({ children }: ButtonProps) => {
  return (
    <button className="rounded-full text-primary-50 p-4 bg-primary-700">
      {children}
    </button>
  );
};
