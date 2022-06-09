import React from "react";
import { m } from "framer-motion";
import { MenuIcon } from "@heroicons/react/outline";

interface SideMenuIconProps {
  openMenuBar: () => void;
}

export default function SideMenuIcon({ openMenuBar }: SideMenuIconProps) {
  return (
    <div>
      <button
        className="bg-primary-200/20 rounded-lg p-1"
        onClick={openMenuBar}
        type="button"
      >
        <MenuIcon className="h-8 w-8" />
      </button>
    </div>
  );
}
