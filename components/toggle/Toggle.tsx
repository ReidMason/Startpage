import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { StateSetter } from "../../types/common";
import { domMax, LazyMotion, m } from "framer-motion";
import { State, Variant } from "../input/types";
import { Switch } from "@headlessui/react";

interface ToggleProps {
  state?: State;
  helperText?: string;
  label?: string;
  value: boolean;
  variant?: Variant;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  state,
  helperText,
  label,
  value,
  variant,
  onChange,
  disabled,
}: ToggleProps) {
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  const disabledStyling = disabled ? "cursor-not-allowed opacity-50" : "";
  const indicatorStyling = value
    ? "justify-end dark:bg-primary-500"
    : "justify-start dark:bg-primary-700";

  return (
    <LazyMotion features={domMax}>
      <Switch.Group as="div" className="flex flex-col">
        <Switch.Label>{label}</Switch.Label>
        <Switch
          checked={value}
          onChange={onChange}
          className="relative mt-1 inline-flex h-6 w-11 items-center rounded-full"
        >
          <span className="sr-only">{label}</span>
          <div
            className={`flex h-full w-full rounded-full ${disabledStyling} ${indicatorStyling}`}
          >
            <m.div
              className="h-6 w-6 rounded-full bg-primary-200"
              layout
              transition={spring}
            />
          </div>
        </Switch>
      </Switch.Group>
    </LazyMotion>
  );
}
