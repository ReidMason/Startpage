import { StateSetter } from "../../types/common";
import { generateUuid } from "../../utils";
import Button from "./button/Button";
import Timer from "./extensions/timer/Timer";
import { Extension } from "./extensions/types";

interface SettingsButtonsProps {
  setSettingsModalOpen: StateSetter<boolean>;
  editMode: boolean;
  setEditMode: StateSetter<boolean>;
  extensions: Array<Extension>;
  setExtensions: StateSetter<Array<Extension>>;
}

export default function SettingsButtons({
  setSettingsModalOpen,
  editMode,
  setEditMode,
  extensions,
  setExtensions,
}: SettingsButtonsProps) {
  const openSettings = () => {
    setSettingsModalOpen(true);
  };

  const addNewModule = (reactComponent: Function) => {
    extensions.push({ id: generateUuid(), element: reactComponent });
    setExtensions([...extensions]);
  };

  return (
    <div className="fixed bottom-0 left-0 m-4 flex gap-4">
      <Button pilled variant="outline" onClick={openSettings}>
        Settings
      </Button>

      <Button
        pilled
        variant="outline"
        onClick={() => setEditMode((prev) => !prev)}
      >
        Enable {editMode ? "view" : "edit"} mode
      </Button>
      <Button pilled variant="outline" onClick={() => addNewModule(Timer)}>
        Add timer
      </Button>
    </div>
  );
}
