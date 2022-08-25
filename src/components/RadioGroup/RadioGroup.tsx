import { RadioGroup as RadioGroupHui } from "@headlessui/react";
import { domMax, LazyMotion, m } from "framer-motion";
import { stiffSpringTransition } from "../../../common";
import FormElementWrapper from "../FormElementWrapper/FormElementWrapper";

interface RadioGroupProps {
  options: Array<string>;
  value: string;
  onChange: (checked: string) => void;
  label?: string;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  label,
}: RadioGroupProps) {
  const chosenIndex = options.findIndex((x) => x === value);

  return (
    <LazyMotion features={domMax}>
      <FormElementWrapper label={label}>
        <RadioGroupHui
          value={value}
          onChange={onChange}
          className="flex flex-col"
        >
          <div className="relative overflow-hidden rounded-lg glassy:backdrop-blur dark:bg-primary-700 dark:glassy:bg-primary-100/20">
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
              }}
            >
              {options.map((option) => (
                <RadioGroupHui.Option
                  value={option}
                  className="z-10"
                  key={option}
                >
                  <div className="cursor-pointer px-3 py-1.5 text-center outline outline-1 outline-primary-100/20 hover:bg-primary-400">
                    {option}
                  </div>
                </RadioGroupHui.Option>
              ))}
            </div>
            <div className="absolute top-0 flex h-full w-full">
              <div
                style={{
                  transform: `translate(${chosenIndex * 100}%, 0)`,
                  width: `${100 / options.length}%`,
                }}
              >
                <m.div
                  className="h-full w-full bg-primary-500"
                  transition={stiffSpringTransition}
                  layout
                />
              </div>
            </div>
          </div>
        </RadioGroupHui>
      </FormElementWrapper>
    </LazyMotion>
  );
}
