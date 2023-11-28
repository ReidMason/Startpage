import { classNames } from "@/utils/utils";
import { Switch } from "@headlessui/react";

interface ToggleProps {
  label?: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}

export const Toggle = ({ value, onChange, onBlur, label }: ToggleProps) => {
  return (
    <Switch
      checked={value}
      onChange={onChange}
      onBlur={onBlur}
      className={classNames(
        value ? "bg-indigo-600" : "bg-gray-200",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
      )}
    >
      {label && <span className="sr-only">{label}</span>}
      <span
        aria-hidden="true"
        className={classNames(
          value ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        )}
      />
    </Switch>
  );
};
