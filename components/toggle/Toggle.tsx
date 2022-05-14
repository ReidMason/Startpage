import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { StateSetter } from "../../types/common";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.checked);
    setter(e.target.checked);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          disabled={disabled}
          className="absolute cursor-pointer opacity-0 disabled:cursor-not-allowed"
          id={id}
          type="checkbox"
          checked={value}
          onChange={handleChange}
        />
        <label
          className={`flex ${
            value ? "bg-primary-300" : "bg-primary-700"
          } h-6 w-12 rounded-full ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          } cursor-pointer`}
          htmlFor={id}
        >
          <div
            className={`h-6 w-6 transform rounded-full bg-primary-200 ${
              value ? "translate-x-6" : ""
            } transition-transform duration-300`}
          ></div>
        </label>
        <p>{value ? "Enabled" : "Disabled"}</p>
      </div>
    </div>
  );
}
