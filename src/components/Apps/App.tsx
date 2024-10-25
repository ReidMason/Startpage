import type { HTMLAttributes } from "react";
import type { App as AppInterface } from "@/services/config/schemas";
import Icon from "@/components/Icon/Icon";

interface AppProps extends HTMLAttributes<HTMLDivElement> {
  app: AppInterface;
  preview?: boolean;
  editable?: boolean;
}

export default function App({ app, preview, editable, ...props }: AppProps) {
  // Remove http, https, trailing slashes and www. from the URL
  let displayUrl = app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0];
  if (displayUrl.startsWith("www.")) displayUrl = displayUrl.slice(4);

  const nonPreviewStyling = preview ? "" : " hover:scale-105";
  props.className = (
    props.className + ` transition duration-200${nonPreviewStyling}`
  ).trim();

  return (
    <div {...props}>
      <a
        className="flex overflow-hidden rounded-lg p-2 text-accent transition duration-200 hover:bg-accent/30 hover:shadow-lg focus:bg-accent-foreground/30 focus:shadow-lg focus:outline-none"
        {...(preview ? {} : { href: app.url })}
      >
        <div className="mr-2 text-4xl">
          <Icon icon={app.icon || "entypo:new-message"} />
        </div>
        <div className="overflow-hidden">
          <p className="lowercase">{app.name || "New app"}</p>
          <p className="truncate text-xs text-card-foreground">
            {displayUrl || "app.example.com"}
          </p>
        </div>
      </a>
    </div>
  );
}
