import { Config } from "@/services/config/schemas";
import React from "react";
import Image from "next/image";

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
  const style = {
    "--transparency-level": config.appearance.opacity / 100,
  } as React.CSSProperties;

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
