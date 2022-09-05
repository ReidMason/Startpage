import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import type { App as AppInterface } from "../../backend/routers/config/schemas";
import type { StateSetter } from "../../../types/common";
import App from "../elements/app/App";
import OldInput from "../input/OldInput";
import Modal from "../modal/Modal";

interface AppEditModalProps {
  app: AppInterface;
  open: boolean;
  setOpen: StateSetter<boolean>;
}

export default function AppEditModal({
  app,
  open,
  setOpen,
}: AppEditModalProps) {
  const { register, getValues } = useForm<AppInterface>({ defaultValues: app });

  const modifiedApp = getValues();

  const saveApp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.warn("Save new app");
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form className="flex flex-col" onSubmit={saveApp}>
        <h1>App edit modal</h1>
        <OldInput register={register("icon")} label="icon" />
        <OldInput register={register("name")} label="name" />
        <OldInput register={register("url")} label="url" />
      </form>
      <div className="w-72 cursor-default">
        <App app={modifiedApp} preview />
      </div>
    </Modal>
  );
}
