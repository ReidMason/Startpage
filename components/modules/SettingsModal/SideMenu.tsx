import React from "react";
import Button from "../../button/Button";
import Input from "../../input/Input";
import { AdjustmentsIcon } from "@heroicons/react/solid";
import { CloudIcon, SearchIcon } from "@heroicons/react/outline";

const buttons = [
  {
    name: "General",
    icon: AdjustmentsIcon,
    bg: "bg-violet-400",
  },
  {
    name: "Weather",
    icon: CloudIcon,
    bg: "bg-green-500",
  },
  {
    name: "Providers",
    icon: SearchIcon,
    bg: "bg-sky-400",
  },
];

export default function SideMenu() {
  return (
    <div className="sticky top-24 flex w-64 flex-col bg-primary-900 p-6 pt-12 text-primary-50">
      <h1 className="mb-4 text-center text-2xl">Settings</h1>
      <Input placeholder="Search..." pilled state="dark" />
      <div className="ml-2 flex flex-col gap-2">
        {buttons.map((button) => (
          <Button className="text-left" variant="ghost" key={button.name}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1 ${button.bg}`}>
                <button.icon />
              </div>
              <span>{button.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
