import { MenuIcon } from "@heroicons/react/outline";

interface SideMenuIconProps {
  openMenuBar: () => void;
}

export default function SideMenuIcon({ openMenuBar }: SideMenuIconProps) {
  return (
    <div>
      <button
        className="rounded-lg bg-primary-200/20 p-1"
        onClick={openMenuBar}
        type="button"
      >
        <MenuIcon className="h-8 w-8" />
      </button>
    </div>
  );
}
