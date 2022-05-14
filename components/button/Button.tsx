import React, { ReactNode, MouseEventHandler } from "react";
import type { Variant, State, Type } from "./types";
import styles from "./button.module.scss";

interface ButtonInputProps {
  children?: ReactNode;
  type?: Type;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  state?: State;
  variant?: Variant;
  pilled?: boolean;
}

export default function Button({
  type,
  children,
  className,
  onClick,
  state,
  variant,
  pilled,
}: ButtonInputProps) {
  const buttonType: Type = type ?? "button";

  const pilledStyles = pilled ? "rounded-full px-3" : "rounded-lg";
  const buttonState = styles[`state-${state ?? "default"}`];
  const buttonVariant = styles[`variant-${variant ?? "default"}`];

  const dynamicStyles = `${pilledStyles} ${buttonState} ${buttonVariant}`;

  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${dynamicStyles} min-w-[8rem] border-2 border-transparent p-1 transition duration-300 ${className}`}
      type={buttonType}
    >
      {children}
    </button>
  );
}
