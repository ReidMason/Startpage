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

interface ExtensionsDisplayProps {
  extensions: Array<Extension>;
  setExtensions: Function;
}

export default function ExtensionsDisplay({
  extensions,
  setExtensions,
}: ExtensionsDisplayProps) {
  const removeExtension = (extensionId: string) => {
    extensions = extensions.filter((x) => x.id !== extensionId);
    setExtensions([...extensions]);
  };

  const spring: Transition = {
    type: "spring",
    duration: 0.25,
  };

  return (
    <LazyMotion features={domMax}>
      <LayoutGrid>
        <AnimatePresence initial={false}>
          {extensions.map((extension) => (
            <m.div layout transition={spring} key={extension.id}>
              <PresenceAnimation
                className="group relative overflow-hidden rounded p-3 transition hover:bg-primary-100/50 hover:shadow-md hover:dark:bg-primary-700"
                key={"animate-" + extension.id}
              >
                <button
                  className="absolute top-0 right-0 rounded-bl-md bg-red-400/80 p-0.5 text-white opacity-0 shadow-sm transition-all hover:-translate-x-0.5 hover:translate-y-0.5 hover:scale-125 group-hover:opacity-100 dark:bg-red-400 dark:text-primary-100"
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
