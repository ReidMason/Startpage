import React from "react";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import { SettingsSectionProps } from "./types";
import { useFieldArray } from "react-hook-form";
import { Input } from "../ui/input";
import { FormControl, FormField, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { generateUuid } from "@/utils/utils";

export default function Providers({
  setActivePage,
  page,
  control,
  loading,
  register,
}: SettingsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "providers",
  });

  return (
    <SettingsPanelWrapper setActivePage={setActivePage} panel={page}>
      {fields.map((_, index) => (
        <div>
          <FormField
            control={control}
            name="appearance.backgroundImageEnabled"
            render={() => (
              <>
                <div className="grid grid-cols-4 items-center gap-y-2">
                  <FormLabel>Prefix</FormLabel>
                  <FormControlWrapper>
                    <Input
                      placeholder="Prefix"
                      autoComplete="off"
                      disabled={loading}
                      {...register(`providers.${index}.prefix`)}
                    />
                  </FormControlWrapper>

                  <FormLabel>Base url</FormLabel>
                  <FormControlWrapper>
                    <Input
                      placeholder="Base url"
                      autoComplete="off"
                      disabled={loading}
                      {...register(`providers.${index}.baseUrl`)}
                    />
                  </FormControlWrapper>

                  <FormLabel>Search url</FormLabel>
                  <FormControlWrapper>
                    <Input
                      placeholder="Search url"
                      autoComplete="off"
                      disabled={loading}
                      {...register(`providers.${index}.searchUrl`)}
                    />
                  </FormControlWrapper>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>

                  <hr className="col-span-4" />
                </div>
              </>
            )}
          />
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({
            id: generateUuid(),
            prefix: "",
            baseUrl: "",
            searchUrl: "",
          })
        }
      >
        Add Provider
      </Button>
    </SettingsPanelWrapper>
  );
}

function FormControlWrapper({ children }: { children: React.ReactNode }) {
  return <FormControl className="col-span-3">{children}</FormControl>;
}
