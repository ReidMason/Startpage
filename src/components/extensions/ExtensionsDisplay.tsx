import {
  AnimatePresence,
  domMax,
  LazyMotion,
  m,
  Transition,
} from "framer-motion";
import PresenceAnimation from "../animations/PresenceAnimation";
import LayoutGrid from "../layoutGrid/LayoutGrid";
import { Extension } from "./types";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
                className="glassy:background-blur group relative overflow-hidden rounded-lg p-3 transition hover:bg-primary-100/50 hover:shadow-md dark:hover:bg-primary-700 dark:glassy:hover:bg-primary-50/20 dark:glassy:focus:bg-primary-100/20"
                key={"animate-" + extension.id}
              >
                <button
                  className="absolute top-0 right-0 rounded-bl-md bg-red-400/80 p-0.5 text-white opacity-0 shadow-sm transition-all hover:-translate-x-0.5 hover:translate-y-0.5 hover:scale-125 group-hover:opacity-100 dark:bg-red-400/70 dark:text-primary-100 hover:dark:bg-red-400/90"
                  onClick={() => removeExtension(extension.id)}
                >
                  <XMarkIcon className="h-4 w-4" />
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
