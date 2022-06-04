import {
  AnimatePresence,
  domMax,
  LazyMotion,
  m,
  Transition,
} from "framer-motion";
import React from "react";
import PresenceAnimation from "../animations/PresenceAnimation";
import LayoutGrid from "../grid/LayoutGrid";
import { Extension } from "./types";
import { XIcon } from "@heroicons/react/outline";
import { Config } from "../../services/server/config/types";

interface ExtensionsDisplayProps {
  extensions: Array<Extension>;
  setExtensions: Function;
  config: Config;
}

export default function ExtensionsDisplay({
  extensions,
  setExtensions,
  config,
}: ExtensionsDisplayProps) {
  const removeExtension = (extensionId: string) => {
    extensions = extensions.filter((x) => x.id !== extensionId);
    setExtensions([...extensions]);
  };

  const spring: Transition = {
    type: "spring",
    duration: 0.25,
  };

  const styling = config.general.glassy
    ? "background-blur focus:bg-primary-100/20 hover:bg-primary-50/20"
    : "hover:bg-primary-100/50 hover:dark:bg-primary-700";

  return (
    <LazyMotion features={domMax}>
      <LayoutGrid>
        <AnimatePresence initial={false}>
          {extensions.map((extension) => (
            <m.div layout transition={spring} key={extension.id}>
              <PresenceAnimation
                className={`${styling} group relative overflow-hidden rounded-lg p-3 transition hover:shadow-md`}
                key={"animate-" + extension.id}
              >
                <button
                  className="absolute top-0 right-0 rounded-bl-md bg-red-400/80 p-0.5 text-white opacity-0 shadow-sm transition-all hover:-translate-x-0.5 hover:translate-y-0.5 hover:scale-125 group-hover:opacity-100 dark:bg-red-400/70 dark:text-primary-100 hover:dark:bg-red-400/90"
                  onClick={() => removeExtension(extension.id)}
                >
                  <XIcon className="h-4 w-4" />
                </button>
                <extension.element />
              </PresenceAnimation>
            </m.div>
          ))}
        </AnimatePresence>
      </LayoutGrid>
    </LazyMotion>
  );
}
