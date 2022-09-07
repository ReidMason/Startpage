import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { generateUuid } from "../../../../../../../utils";
import Button from "../../../../../button/Button";
import OldFormElementWrapper from "../../../../../FormElementWrapper/OldFormElementWrapper";
import Input from "../../../../../input/Input";
import OldInput from "../../../../../input/OldInput";
import { SettingsElement } from "../../../types";
import { SettingsElementComponent } from "../types";

const Providers: SettingsElementComponent = ({ control, register }) => {
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
    <table className="border-separate border-spacing-2">
      <tr>
        <th className="w-2 sm:w-12">Prefix</th>
        <th>Search URL</th>
        <th className="w-6"></th>
      </tr>
      {fields.map((field, index) => (
        <tr key={field.key}>
          <td>
            <Input register={register(`providers.${index}.prefix`)} />
          </td>
          <td>
            <Input register={register(`providers.${index}.searchUrl`)} />
          </td>
          <td>
            <Button
              className="flex min-w-0 justify-center px-1 sm:min-w-0"
              state="danger"
              onClick={() => remove(index)}
            >
              <TrashIcon className="h-6 w-6" />
            </Button>
          </td>

          {/* <OldInput
            className="sm:w-40"
            label="Name"
            register={register(`providers.${index}.name`)}
          />

          <OldInput
            className="sm:w-40"
            label="Prefix"
            register={register(`providers.${index}.prefix`)}
          />
          <OldInput
            className="w-full"
            label="Search Url"
            register={register(`providers.${index}.searchUrl`)}
          />

          <div className="sm:hidden">
            <OldFormElementWrapper>
              <Button
                className="flex min-w-0 justify-center px-1 sm:min-w-0"
                state="danger"
                onClick={() => remove(index)}
              >
                <TrashIcon className="h-6 w-6" />
              </Button>
            </OldFormElementWrapper>
          </div>

          <div className="hidden sm:block">
            <OldFormElementWrapper label=" ">
              <Button
                className="flex min-w-0 justify-center px-1 sm:min-w-0"
                state="danger"
                onClick={() => remove(index)}
              >
                <TrashIcon className="h-6 w-6" />
              </Button>
            </OldFormElementWrapper>
          </div> */}
        </tr>
      ))}

      <Button
        className="col-span-full mt-4"
        state="success"
        onClick={createNewProvider}
      >
        New
      </Button>
    </table>
  );
};

const settingsElement: SettingsElement = {
  component: Providers,
  name: "Providers",
  altNames: ["shortcut", "shortcuts"],
};

export default settingsElement;
