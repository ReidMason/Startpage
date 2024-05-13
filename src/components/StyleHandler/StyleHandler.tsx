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
    filter: `blur(${config.appearance.backgroundBlur / 2}px)`,
  } as React.CSSProperties;

  return (
    <div
      className={config.appearance.glassy ? "glassy" : undefined}
      style={style}
    >
      {config.appearance.backgroundEnabled && (
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
    </div>
  );
}
