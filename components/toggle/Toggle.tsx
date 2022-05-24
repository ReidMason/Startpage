import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, useEffect, useState } from "react";
import { StateSetter } from "../../types/common";
import { domMax, LazyMotion, m } from "framer-motion";

interface ToggleProps {
  defaultValue: boolean;
  setter: StateSetter<boolean>;
  disabled?: boolean;
}

export default function Toggle({
  defaultValue,
  setter,
  disabled,
}: ToggleProps) {
  const [value, setValue] = useState(defaultValue);
  const [id, setId] = useState<string>();

  useEffect(() => {
    // Genrate unique id
    setId(uuidv4());
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.checked);
    setter(e.target.checked);
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <div className="flex items-center gap-2">
      <LazyMotion features={domMax}>
        <input
          disabled={disabled}
          className="absolute cursor-pointer opacity-0 disabled:cursor-not-allowed"
          id={id}
          type="checkbox"
          checked={value}
          onChange={handleChange}
        />
        <label
          className={`flex ${value ? "" : ""} h-6 w-12 rounded-full ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          } ${
            value
              ? "justify-end bg-primary-500"
              : "justify-start bg-primary-700"
          } cursor-pointer`}
          htmlFor={id}
        >
          <m.div
            className="h-6 w-6 rounded-full bg-primary-200"
            layout
            transition={spring}
          />
        </label>
        <p>{value ? "Enabled" : "Disabled"}</p>
      </LazyMotion>
    </div>
  );
}
