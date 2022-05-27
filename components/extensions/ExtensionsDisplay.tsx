import {
  AnimatePresence,
  domMax,
  LazyMotion,
  m,
  Transition,
} from "framer-motion";
import React from "react";
import PresenceAnimation from "../animations/PresenceAnimation";
import { Extension } from "./types";

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
      <div className="mt-24 flex flex-wrap gap-4">
        <AnimatePresence initial={false}>
          {extensions.map((extension) => (
            <m.div layout transition={spring} key={extension.id}>
              <PresenceAnimation
                className="hover:bg-nord-1 group relative overflow-hidden rounded p-3 hover:shadow-md"
                key={"animate-" + extension.id}
              >
                <button
                  className="text-nord-4 bg-nord-11 absolute top-0 right-0 rounded-bl-md p-0.5 opacity-0 shadow-sm transition-all hover:-translate-x-0.5 hover:translate-y-0.5 hover:scale-125 group-hover:opacity-100"
                  onClick={() => removeExtension(extension.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <extension.element />
              </PresenceAnimation>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
