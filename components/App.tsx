import { Icon } from "@iconify/react";
import React from "react";
import { App as AppInterface } from "../services/config/types";

interface AppProps {
  app: AppInterface;
  preview?: boolean;
}

export default function App({ app, preview }: AppProps) {
  // Remove http, https and trailing slashes
  const displayUrl = app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0];

  return (
    <a
      className="flex cursor-pointer items-center rounded border border-primary-400 border-opacity-0 p-2 text-primary-50 transition hover:border-opacity-80 hover:bg-primary-400 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none"
      {...(preview ? {} : { href: app.url })}
    >
      <div className="mr-2 text-4xl text-primary-300">
        <Icon icon={app.icon || "entypo:new-message"} />
      </div>
      <div>
        <p className="lowercase text-white">{app.name || "New app"}</p>
        <p className="text-xs text-primary-200">
          {displayUrl || "app.example.com"}
        </p>
      </div>
    </a>
  );
}
