import React, { useState } from "react";
import ReactDropzone, { FileRejection } from "react-dropzone";
import FormElementWrapper from "../FormElementWrapper/FormElementWrapper";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

interface DropzoneProps {
  onFileUpload: (files: Array<File>) => void;
  loading?: boolean;
  icon: ({}) => JSX.Element;
  mainText: string;
  smallText: string;
  backgroundUrl?: string;
}

const errorCodeMappings: { [key: string]: string } = {
  "file-invalid-type": "File type must be jpeg, png or gif",
  "too-many-files": "Only one file can be uploaded",
};

export default function Dropzone({
  onFileUpload,
  loading,
  icon: Icon,
  mainText,
  smallText,
  backgroundUrl,
}: DropzoneProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [draggedOver, setDraggedOver] = useState(false);

  const dropRejected = (data: Array<FileRejection>) => {
    if (data.length === 0 || data[0].errors.length === 0) {
      setErrorMessage("Invalid image file");
      return;
    }

    const errorMessage =
      errorCodeMappings[data[0].errors[0].code] ?? data[0].errors[0].message;
    setErrorMessage(errorMessage);
  };

  const dropAccepted = (data: Array<File>) => {
    setErrorMessage("");
    onFileUpload(data);
  };

  const loadingStyles = loading ? "opacity-50" : "hover:text-green-300";

  return (
    <FormElementWrapper
      label="Upload a background image"
      helperText={errorMessage}
      state="danger"
    >
      <ReactDropzone
        onDrop={() => setDraggedOver(false)}
        onDragOver={() => setDraggedOver(true)}
        onDragLeave={() => setDraggedOver(false)}
        onDropRejected={dropRejected}
        onDropAccepted={dropAccepted}
        accept={{ "image/*": [".jpeg", ".png", ".gif"] }}
        maxFiles={1}
        disabled={loading}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={`cursor-default overflow-hidden rounded-lg bg-primary-100/40 ${loadingStyles} ${
              draggedOver && "text-green-300"
            }`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div
              className="flex items-center justify-center gap-4 bg-black/50 bg-cover p-8 bg-blend-darken"
              style={{
                backgroundImage: backgroundUrl
                  ? `url("${backgroundUrl}")`
                  : undefined,
              }}
            >
              <div className="h-12 w-12">
                {loading ? <LoadingSpinner /> : <Icon />}
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{mainText}</p>
                <small className="dark:text-primary-50/80">{smallText}</small>
              </div>
            </div>
          </div>
        )}
      </ReactDropzone>
    </FormElementWrapper>
  );
}
