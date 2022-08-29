import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import type { App as AppInterface } from "../../../backend/routers/config/schemas";
import type { StateSetter } from "../../../../types/common";
import App from "../../elements/app/App";
import Input from "../../input/Input";
import Modal from "../../modal/Modal";

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

  return (
    <Modal open={open} setOpen={setOpen}>
      <form className="flex flex-col" onSubmit={saveApp}>
        <h1>App edit modal</h1>
        <Input register={register("icon")} label="icon" />
        <Input register={register("name")} label="name" />
        <Input register={register("url")} label="url" />
      </form>
      <div className="w-72 cursor-default">
        <App app={modifiedApp} preview />
      </div>
    </Modal>
  );
}
