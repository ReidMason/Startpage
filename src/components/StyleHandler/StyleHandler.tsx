import { Config } from "@/services/config/schemas";
import React from "react";
import Image from "next/image";
import { themeColours } from "./Themes";

interface StyleHandlerProps {
  children: React.ReactNode;
  config: Config;
  imageUrl: string;
}

export default function StyleHandler({
  config,
  imageUrl,
  children,
}: StyleHandlerProps) {
  const style: Record<string, string | number> = {
    "--transparency-level": config.appearance.opacity / 100,
  };

  // Set theme colour variables
  const theme =
    config.appearance.theme != "custom"
      ? themeColours[config.appearance.theme]
      : config.appearance.customTheme;
  for (const [key, value] of Object.entries(theme)) {
    style[`--${key}`] = value;
  }

  const imageContainerStyle = {
    filter: `blur(${config.appearance.backgroundBlur / 4}px)`,
  } as React.CSSProperties;

  return (
    <body style={style} className={config.appearance.theme.toString()}>
      {config.appearance.backgroundImageEnabled && (
        <div className="fixed h-full w-full" style={imageContainerStyle}>
          <Image
            src={imageUrl}
            width={1920}
            height={1080}
            alt="background"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {children}
    </body>
  );
}