import React from "react";
import { m } from "framer-motion";
import { MenuIcon } from "@heroicons/react/outline";

interface SideMenuIconProps {
  openMenuBar: () => void;
}

export default function SideMenuIcon({ openMenuBar }: SideMenuIconProps) {
  return (
    <m.div
      className="fixed bottom-0 z-20"
      key="menu-open-button"
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { y: 0 },
        collapsed: { y: 50 },
      }}
      transition={{
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
      }}
    >
      <button
        className="rounded-full bg-primary-900/50 p-2 shadow-xl"
        onClick={openMenuBar}
      >
        <MenuIcon className="h-8 w-8" />
      </button>
    </m.div>
  );
}
