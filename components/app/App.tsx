import { Icon } from "@iconify/react";
import { App as AppInterface } from "../../services/server/config/types";

interface AppProps {
  app: AppInterface;
  preview?: boolean;
}

export default function App({ app, preview }: AppProps) {
  // Remove http, https and trailing slashes
  const displayUrl = app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0];

  return (
    <div className="overflow-hidden rounded-lg dark:text-primary-100">
      <a
        className={`flex flex-1 items-center overflow-hidden text-ellipsis  p-2 pl-4 duration-200 first-line:transition hover:scale-105 hover:bg-primary-100 hover:shadow-lg focus:bg-primary-100 focus:shadow-lg focus:outline-none hover:dark:bg-primary-100/30 focus:dark:bg-primary-100/30`}
        {...(preview ? {} : { href: app.url })}
      >
        <div className="mr-2 text-4xl">
          <Icon icon={app.icon || "entypo:new-message"} />
        </div>
        <div>
          <p className="lowercase dark:text-primary-50">
            {app.name || "New app"}
          </p>
          <p className="text-xs text-primary-300 dark:text-white">
            {displayUrl || "app.example.com"}
          </p>
        </div>
      </a>
    </div>
  );
}
