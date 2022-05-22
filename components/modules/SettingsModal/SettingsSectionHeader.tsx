import { SVGProps } from "react";

interface SettingsSectionHeaderProps {
  name: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconBg: string;
}

export default function SettingsSectionHeader({
  icon: Icon,
  iconBg,
  name,
}: SettingsSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className={`rounded-lg p-1 ${iconBg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-xl">{name}</h2>
    </div>
  );
}
