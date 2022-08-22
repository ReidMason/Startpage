import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { App as AppInterface } from "../../../../services/server/config/types";
import { StateSetter } from "../../../../types/common";
import App from "../../app/App";
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
  const {
    register,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<AppInterface>({ defaultValues: app });

  watch();
  const modifiedApp = getValues();

  const saveApp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.warn("Save new app");
  };

  useEffect(() => {
    reset(app);
  }, [app, reset]);

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
