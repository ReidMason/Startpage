import Button from "../../button/Button";
import Input from "../../input/Input";
import { settingsSections } from "./SettingsContent";

export default function SideMenu() {
  return (
    <div className="sticky top-24 flex h-full w-64 flex-col p-6 pt-12 text-primary-50 dark:bg-primary-900">
      <h1 className="mb-4 text-center text-2xl">Settings</h1>
      <Input placeholder="Search..." pilled state="dark" />
      <div className="ml-2 flex flex-col gap-2">
        {settingsSections.map((section) => (
          <Button className="text-left" variant="ghost" key={section.name}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1 ${section.iconBg}`}>
                <section.icon />
              </div>
              <span>{section.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
