import HorizontalRule from "../../../horizontal rule/HorizontalRule";
import { SettingsSection, SettingsSectionProps } from "../types";
import SettingsSectionHeader from "./SettingsSectionHeader";

interface SettingsSectionWrapperProps {
  section: SettingsSection;
  sectionProps: SettingsSectionProps;
}

export default function SettingsSectionWrapper({
  section,
  sectionProps,
}: SettingsSectionWrapperProps) {
  const sectionData = ({ ref, ...section }: SettingsSection): SettingsSection =>
    section;

  return (
    <div className="rounded-xl bg-primary-800/50 p-4 shadow">
      <SettingsSectionHeader {...sectionData(section)} />
      <div className="mt-4 grid grid-cols-1 gap-4">
        {section.settingsElements.map((settingsElement) => (
          <div className="flex flex-col gap-4" key={settingsElement.name}>
            <settingsElement.component {...sectionProps} />
            <HorizontalRule />
          </div>
        ))}
      </div>
    </div>
  );
}
