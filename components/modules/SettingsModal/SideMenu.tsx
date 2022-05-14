import React from "react";
import Button from "../../button/Button";
import TextInput from "../../input/Input";

const buttons = [
  {
    name: "General",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
      </svg>
    ),
    bg: "bg-violet-400",
  },
  {
    name: "Weather",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
    bg: "bg-green-500",
  },
  {
    name: "Providers",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-sky-400",
  },
];

export default function SideMenu() {
  return (
    <div className="sticky top-24 flex w-64 flex-col bg-primary-900 p-6 pt-12 text-primary-50">
      <h1 className="mb-4 text-center text-2xl">Settings</h1>
      <TextInput placeholder="Search..." pilled state="dark" />
      <div className="ml-2 flex flex-col gap-2">
        {buttons.map((button) => (
          <Button className="text-left" variant="ghost">
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1 ${button.bg}`}>{button.icon}</div>
              <span>{button.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
