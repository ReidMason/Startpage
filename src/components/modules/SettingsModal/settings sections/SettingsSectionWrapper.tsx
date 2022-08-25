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
    <div key={section.name} className="flex flex-col">
      <div>
        <Collapse
          header={
            <SettingsSectionHeader
              {...sectionData(section)}
              heading={
                section.heading ? (
                  <section.heading {...sectionProps} />
                ) : undefined
              }
            />
          }
          body={
            <div className="mb-4 lg:pl-4">
              {section.customLayout ? (
                <section.content {...sectionProps} />
              ) : (
                <div className="grid grid-cols-1 items-start gap-4 gap-x-4 md:grid-cols-2 xl:grid-cols-3">
                  <section.content {...sectionProps} />
                </div>
              )}
            </div>
          }
        />
      </div>
      <HorizontalRule />
    </div>
  );
}