import { domMax, LazyMotion, m } from "framer-motion";
import { Switch as SwitchHui } from "@headlessui/react";
import { springTranstition } from "../../../common";

interface ToggleProps {
  value: boolean;
  onChange: (checked: boolean) => void;
}

export default function Switch({ value, onChange }: ToggleProps) {
  // const disabledStyling = disabled ? "cursor-not-allowed opacity-50" : "";

  const indicatorStyling = value
    ? "justify-end dark:bg-green-500"
    : "justify-start dark:glassy:bg-primary-100/10";

  return (
    <LazyMotion features={domMax}>
      <SwitchHui.Group>
        <SwitchHui
          checked={value}
          onChange={onChange}
          className="relative inline-flex h-7 w-12 items-center overflow-hidden rounded-full"
        >
          <div
            className={`flex h-full w-full items-center px-0.5 ${indicatorStyling}`}
          >
            {/* The switch ball */}
            <m.div
              className="h-6 w-6 rounded-full bg-primary-200"
              layout
              layoutDependency={indicatorStyling}
              transition={springTranstition}
            />
          </div>
        </SwitchHui>
      </SwitchHui.Group>
    </LazyMotion>
  );
}
