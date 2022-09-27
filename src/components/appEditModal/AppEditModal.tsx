import { useForm } from "react-hook-form";
import App from "../elements/app/App";
import Modal from "../modal/Modal";
import Input from "../input/Input";
import FormElementWrapper from "../FormElementWrapper/FormElementWrapper";
import type { StateSetter } from "../../../types/common";
import type { App as AppInterface } from "../../backend/routers/config/schemas";
import { FormEvent, useEffect } from "react";
import HorizontalRule from "../horizontal rule/HorizontalRule";
import Button from "../button/Button";

interface AppEditModalProps {
  app: AppInterface;
  open: boolean;
  setOpen: StateSetter<boolean>;
  saveApp: (app: AppInterface) => void;
}

export default function AppEditModal({
  app,
  open,
  setOpen,
  saveApp,
}: AppEditModalProps) {
  const { register, watch, reset } = useForm<AppInterface>({
    defaultValues: app,
  });

  const modifiedApp = watch();

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveApp(modifiedApp);
    closeModal();
  };

  const closeModal = () => {
    reset();
    setOpen(false);
  };

  useEffect(() => {
    reset(app);
  }, [app]);

  return (
    <Modal open={open} onClose={closeModal}>
      <form className="flex flex-col gap-4 p-4" onSubmit={submitForm}>
        <h3 className="text-2xl">Edit app</h3>
        <HorizontalRule />
        <div className="flex justify-center">
          <div className="w-72 cursor-default">
            <App app={modifiedApp} preview />
          </div>
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

        <div className="mt-4 flex justify-between">
          <Button type="submit" state="success">
            Save
          </Button>
          <Button onClick={closeModal}>Exit</Button>
        </div>
      </form>
    </Modal>
  );
}
