import { useFieldArray } from "react-hook-form";
import { generateUuid } from "../../../../../../utils";
import Button from "../../../../button/Button";
import FormElementWrapper from "../../../../FormElementWrapper/FormElementWrapper";
import Input from "../../../../input/Input";
import { SettingsSectionProps } from "../../types";
import { TrashIcon } from "@heroicons/react/outline";

export default function ProvidersSettings({
  control,
  register,
}: SettingsSectionProps) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: "providers",
    keyName: "key",
  });

  const createNewProvider = () => {
    append({
      baseUrl: "",
      id: generateUuid(),
      name: "",
      prefix: "",
      searchUrl: "",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div
          key={field.key}
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Input
            className="sm:w-40"
            label="Name"
            register={register(`providers.${index}.name`)}
          />

          <Input
            className="sm:w-40"
            label="Prefix"
            register={register(`providers.${index}.prefix`)}
          />
          <Input
            className="w-full"
            label="Search Url"
            register={register(`providers.${index}.searchUrl`)}
          />

          <div className="sm:hidden">
            <FormElementWrapper>
              <Button
                className="flex min-w-0 justify-center px-1 sm:min-w-0"
                state="danger"
                onClick={() => remove(index)}
              >
                <TrashIcon className="h-6 w-6" />
              </Button>
            </FormElementWrapper>
          </div>

          <div className="hidden sm:block">
            <FormElementWrapper label=" ">
              <Button
                className="flex min-w-0 justify-center px-1 sm:min-w-0"
                state="danger"
                onClick={() => remove(index)}
              >
                <TrashIcon className="h-6 w-6" />
              </Button>
            </FormElementWrapper>
          </div>
        </div>
      ))}

      <Button className="mt-4" state="success" onClick={createNewProvider}>
        New
      </Button>
    </div>
  );
}
