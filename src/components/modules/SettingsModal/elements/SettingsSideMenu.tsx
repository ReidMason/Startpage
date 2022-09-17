import { StateSetter } from "../../../../../types/common";
import Button from "../../../button/Button";
import Input from "../../../input/Input";
import { SettingsSection } from "../types";

interface SettingsSideMenuProps {
  settingsSearch: string;
  setSettingsSearch: StateSetter<string>;
  scrolledSectionName: string;
  closeMenuBar: () => void;
  settingsSections: Array<SettingsSection>;
}

export default function SettingsSideMenu({
  settingsSearch,
  setSettingsSearch,
  scrolledSectionName,
  closeMenuBar,
  settingsSections,
}: SettingsSideMenuProps) {
  const scrollToSection = (section: SettingsSection) => {
    const current = section.ref?.current;
    if (!current) return;
    current.scrollIntoView();
    if (window.innerWidth < 922) {
      closeMenuBar();
    }
  };

  return (
    <div className="flex h-full w-64 flex-col gap-4 rounded-xl p-6 pt-12 text-primary-50 glassy:backdrop-blur-3xl dark:bg-primary-900 dark:glassy:bg-primary-900/40">
      <h1 className="mb-4 text-center text-2xl">Settings</h1>
      <Input
        placeholder="Search..."
        value={settingsSearch}
        onChange={setSettingsSearch}
        clearable
      />
      <div className="flex flex-col gap-2">
        {settingsSections.map((section, index) => (
          <Button
            className={`text-left 
              ${
                scrolledSectionName === section.name
                  ? "bg-primary-200 dark:bg-primary-500"
                  : ""
              }
            `}
            variant="ghost"
            onClick={() => scrollToSection(section)}
            key={section.name}
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1 ${section.iconBg}`} />
              <span>{section.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
