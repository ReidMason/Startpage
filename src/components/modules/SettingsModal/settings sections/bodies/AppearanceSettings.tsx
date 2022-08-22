import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  appearances,
  PartialConfig,
} from "../../../../../backend/routers/config/schemas";
import Dropzone from "../../../../dropzone/Dropzone";
import RadioGroup from "../../../../RadioGroup/RadioGroup";
import Switch from "../../../../switch/Switch";
import { SettingsSectionProps } from "../../types";
import { UploadIcon } from "@heroicons/react/outline";
import { trpc } from "../../../../../utils/trpc";

export default function AppearanceSettings({
  control,
  config,
}: SettingsSectionProps) {
  const [fileUploading, setFileUploading] = useState(false);
  const configMutation = trpc.useMutation(["config.save"]);
  const trpcUtils = trpc.useContext();

  const saveConfig = async (newConfig: PartialConfig) => {
    await configMutation.mutateAsync(newConfig, {
      onSuccess: () => {
        trpcUtils.invalidateQueries(["config.get"]);
      },
    });
  };

  const onFileUpload = async (files: Array<File>) => {
    if (files.length === 0) return;

    setFileUploading(true);
    const body = new FormData();
    body.append("file", files[0], files[0].name);

    const response = await fetch("/api/background", {
      method: "POST",
      body,
    });

    if (response.ok) saveConfig({});
    setFileUploading(false);
  };

  return (
    <>
      <Controller
        control={control}
        name="appearance.appearance"
        render={({ field: { ref, ...field } }) => (
          <RadioGroup
            label="Theme"
            {...field}
            options={[...appearances]}
            glassy={config.appearance.glassy}
          />
        )}
      />

      <Controller
        control={control}
        name="appearance.glassy"
        render={({ field: { ref, ...field } }) => (
          <div className="flex items-end">
            <Switch label="Glassy theme" {...field} />
            <small className="mb-1 hidden opacity-70 firefox:block">
              Partially supported on{" "}
              <a
                className="text-primary-300"
                href="https://bugzilla.mozilla.org/show_bug.cgi?id=1578503"
                target="_blank"
                rel="noreferrer"
              >
                Firefox
              </a>
            </small>
          </div>
        )}
      />

      <Controller
        control={control}
        name="appearance.backgroundEnabled"
        render={({ field: { ref, ...field } }) => (
          <Switch label="Background image" {...field} />
        )}
      />

      <div className="sm:col-span-2">
        <Dropzone
          onFileUpload={onFileUpload}
          icon={UploadIcon}
          loading={fileUploading}
          mainText="Drag an image file here or click to select a file"
          mainTextMobile="Tap here to upload an image"
          smallText="The smaller the file size, the faster the image will load"
          backgroundUrl={`/static/background.png?v=${config.general.cacheKey}`}
        />
      </div>
    </>
  );
}
