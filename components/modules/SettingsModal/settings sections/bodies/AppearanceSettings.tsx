import React, { useContext, useState } from "react";
import { Controller } from "react-hook-form";
import GlobalContext from "../../../../../contexts/GlobalContext/GlobalContext";
import { appearances } from "../../../../../services/server/config/types";
import Dropzone from "../../../../dropzone/Dropzone";
import RadioGroup from "../../../../RadioGroup/RadioGroup";
import Switch from "../../../../switch/Switch";
import { SettingsSectionProps } from "../../types";
import { UploadIcon } from "@heroicons/react/outline";

export default function AppearanceSettings({
  control,
  config,
}: SettingsSectionProps) {
  const { updateCacheKey } = useContext(GlobalContext);
  const [fileUploading, setFileUploading] = useState(false);

  const onFileUpload = async (files: Array<File>) => {
    if (files.length === 0) return;

    setFileUploading(true);
    const body = new FormData();
    body.append("file", files[0], files[0].name);

    const response = await fetch("/api/background", {
      method: "POST",
      body,
    });

    if (response.ok) updateCacheKey();
    setFileUploading(false);
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
        <Dropzone
          onFileUpload={onFileUpload}
          icon={UploadIcon}
          loading={fileUploading}
          mainText="Drag an image file here or click to select a file"
          smallText="The smaller the file size, the faster the image will load"
          backgroundUrl={`/static/background.png?v=${config.general.cacheKey}`}
        />
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
