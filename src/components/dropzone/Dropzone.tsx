import { useState } from "react";
import ReactDropzone from "react-dropzone";
import type { FileRejection } from "react-dropzone";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

interface DropzoneProps {
  onFileUpload: (files: Array<File>) => void;
  loading?: boolean;
  icon: ({}) => JSX.Element;
  mainText: string;
  mainTextMobile: string;
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
  mainTextMobile,
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
            draggedOver ? "text-green-300" : ""
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div
            className="flex items-center justify-center gap-4 bg-black/50 bg-cover p-4 bg-blend-darken sm:p-8"
            style={{
              backgroundImage: backgroundUrl
                ? `url("${backgroundUrl}")`
                : undefined,
            }}
          >
            <div className="w-12">
              {loading ? <LoadingSpinner /> : <Icon />}
            </div>
            <div className="flex flex-col">
              <div className="text-md font-semibold sm:text-lg">
                <p className="hidden sm:block">{mainText}</p>
                <p className="block sm:hidden">{mainTextMobile}</p>
              </div>
              <small className="dark:text-primary-50/80">{smallText}</small>
            </div>
          </div>
        </div>
      )}
    </ReactDropzone>
  );
}
