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
    <div className="flex items-center gap-3">
      <div className={`rounded-lg p-1 ${iconBg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-xl">{name}</h2>
      <div className="ml-4">{heading}</div>
    </div>
  );
}
