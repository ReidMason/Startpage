import { Icon } from "@iconify/react";
import React from "react";
import { App as AppInterface } from "../services/config/types";

interface AppProps {
  app: AppInterface;
  preview?: boolean;
  editMode?: boolean;
  isDragging?: boolean;
}

export default function App({ app, preview, editMode, isDragging }: AppProps) {
  // Remove http, https and trailing slashes
  const displayUrl = app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0];

  const openEditModal = () => {
    console.log("Test");
  };

  return (
    <a
      className={`flex flex-1 items-center rounded border border-primary-400/0 p-2 transition hover:border-primary-400/80 hover:bg-primary-900 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none`}
      {...(preview ? {} : { href: app.url })}
    >
      <div className="mr-2 text-4xl text-primary-300">
        <Icon icon={app.icon || "entypo:new-message"} />
      </div>
      <div>
        <p className="lowercase text-primary-50">{app.name || "New app"}</p>
        <p className="text-xs text-white">{displayUrl || "app.example.com"}</p>
      </div>
    </a>
  );
}
