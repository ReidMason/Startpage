import React, { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Dropzone from "../../../../../dropzone/Dropzone";
import { SettingsElementComponent } from "../types";

const BackgroundImageUpload: SettingsElementComponent = ({
  saveConfig,
  config,
}) => {
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

    if (response.ok) saveConfig({}, true, true);
    setFileUploading(false);
  };

  return (
    <Dropzone
      onFileUpload={onFileUpload}
      icon={ArrowUpTrayIcon}
      loading={fileUploading}
      mainText="Drag an image file here or click to select a file"
      mainTextMobile="Tap here to upload an image"
      smallText="The smaller the file size, the faster the image will load"
      backgroundUrl={`/static/background.png?v=${config.general.cacheKey}`}
    />
  );
};

export default BackgroundImageUpload;
