import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { generateUuid } from "../../../../../../../utils";
import Button from "../../../../../button/Button";
import Input from "../../../../../input/Input";
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
      prefix: "",
      searchUrl: "",
    });
  };

  return (
    <>
      <table className="border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="w-2 sm:w-12">Prefix</th>
            <th>Search URL</th>
            <th className="w-6"></th>
          </tr>
        </thead>
        <tbody>
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
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        className="col-span-full mt-4"
        state="success"
        onClick={createNewProvider}
      >
        New
      </Button>
    </>
  );
};

const settingsElement: SettingsElement = {
  component: Providers,
  name: "Providers",
  altNames: ["shortcut", "shortcuts"],
};

export default settingsElement;
