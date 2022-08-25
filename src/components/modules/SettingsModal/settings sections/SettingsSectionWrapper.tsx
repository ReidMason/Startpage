import Collapse from "../../../collapse/Collapse";
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
    <>
      <Collapse header={<SettingsSectionHeader {...sectionData(section)} />}>
        <div className="mb-4 lg:pl-4">
          {section.hasCustomLayout ? (
            <section.content {...sectionProps} />
          ) : (
            <div className="grid grid-cols-6 gap-4">
              <section.content {...sectionProps} />
            </div>
          )}
        </div>
      </Collapse>
      <HorizontalRule />
    </>
  );
}
