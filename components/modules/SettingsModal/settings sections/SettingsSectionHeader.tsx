import { SVGProps } from "react";

interface SettingsSectionHeaderProps {
  name: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconBg: string;
  heading: JSX.Element | undefined;
}

export default function SettingsSectionHeader({
  icon: Icon,
  iconBg,
  name,
  heading,
}: SettingsSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className={`rounded-lg p-1 ${iconBg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-2xl">{name}</h2>
      {heading}
    </div>
  );
}