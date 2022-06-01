import React from "react";
import { useFieldArray } from "react-hook-form";
import Input from "../../../../input/Input";
import { SettingsSectionProps } from "../../types";

export default function ProvidersSettings({
  control,
  register,
}: SettingsSectionProps) {
  const { fields } = useFieldArray({
    control,
    name: "providers",
  });

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4">
          <Input
            className="w-40"
            label="Name"
            register={register(`providers.${index}.name`)}
          />

          <Input
            className="w-40"
            label="Prefix"
            register={register(`providers.${index}.prefix`)}
          />
          <Input
            className="w-full"
            label="Search Url"
            register={register(`providers.${index}.searchUrl`)}
          />
        </div>
      ))}
    </>
  );
}

// id: string;
// baseUrl: string;
// name: string;
// prefix: string;
// searchUrl: string;
