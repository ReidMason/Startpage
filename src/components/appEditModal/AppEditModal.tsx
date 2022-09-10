import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import type { App as AppInterface } from "../../backend/routers/config/schemas";
import type { StateSetter } from "../../../types/common";
import App from "../elements/app/App";
import Modal from "../modal/Modal";
import Input from "../input/Input";
import FormElementWrapper from "../FormElementWrapper/FormElementWrapper";

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
      <form
        className="flex flex-col gap-4 bg-primary-900/40 p-8"
        onSubmit={saveApp}
      >
        <h3 className="text-2xl">App edit modal</h3>
        <div className="w-72 cursor-default">
          <App app={modifiedApp} preview />
        </div>
        <div className="flex flex-col gap-2">
          <FormElementWrapper label="Icon">
            <Input register={register("icon")} />
          </FormElementWrapper>
          <FormElementWrapper label="Name">
            <Input register={register("name")} />
          </FormElementWrapper>

          <FormElementWrapper label="URL">
            <Input register={register("url")} />
          </FormElementWrapper>
        </div>
      </form>
    </Modal>
  );
}
