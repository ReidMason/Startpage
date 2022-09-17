import { Bars3Icon } from "@heroicons/react/24/outline";

interface SideMenuToggleIconProps {
  toggleMenuBar: () => void;
}

export default function SideMenuToggleIcon({
  toggleMenuBar: openMenuBar,
}: SideMenuToggleIconProps) {
  return (
    <div>
      <button
        className="rounded-lg bg-primary-200/20 p-1"
        onClick={openMenuBar}
        type="button"
      >
        <Bars3Icon className="h-8 w-8" />
      </button>
    </div>
  );
}
