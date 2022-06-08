import React, { useContext } from "react";
import { Controller } from "react-hook-form";
import GlobalContext from "../../../../../contexts/GlobalContext/GlobalContext";
import { appearances } from "../../../../../services/server/config/types";
import Dropzone from "../../../../dropzone/Dropzone";
import RadioGroup from "../../../../RadioGroup/RadioGroup";
import Switch from "../../../../switch/Switch";
import { SettingsSectionProps } from "../../types";
import { UploadIcon } from "@heroicons/react/outline";
import Image from "next/image";

export default function AppearanceSettings({
  control,
  config,
}: SettingsSectionProps) {
  const { updateCacheKey } = useContext(GlobalContext);

  const onFileUpload = async (files: Array<File>) => {
    if (files.length === 0) return;

    const body = new FormData();
    body.append("file", files[0], files[0].name);

    const response = await fetch("/api/savebg", {
      method: "POST",
      body,
    });

    if (response.ok) updateCacheKey();
  };

  return (
    <>
      <Controller
        control={control}
        name="appearance.appearance"
        render={({ field: { ref, ...field } }) => (
          <RadioGroup
            label="Appearance"
            {...field}
            options={[...appearances]}
            glassy={config.appearance.glassy}
          />
        )}
      />
      <div className="lg:col-span-2">
        <Controller
          control={control}
          name="appearance.glassy"
          render={({ field: { ref, ...field } }) => (
            <Switch label="Glassy theme" {...field} />
          )}
        />
      </div>

      <div className="col-span-2">
        <Dropzone onFileUpload={onFileUpload}>
          <div
            className="flex items-center justify-center gap-4 bg-black/50 bg-cover p-8 bg-blend-darken"
            style={{
              backgroundImage: `url("/static/background.png?v=${config.general.cacheKey}")`,
            }}
          >
            <UploadIcon className="h-12 w-12" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">
                Drag an image file here or click to select a file
              </p>
              <small className="text-primary-50/80">
                The smaller the file size, the faster the image will load
              </small>
            </div>
          </div>
        </Dropzone>
      </div>

      <Controller
        control={control}
        name="appearance.backgroundEnabled"
        render={({ field: { ref, ...field } }) => (
          <Switch label="Background image enabled" {...field} />
        )}
      />
    </>
  );
}
