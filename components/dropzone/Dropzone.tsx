import React, { useState } from "react";
import ReactDropzone, { FileRejection } from "react-dropzone";
import FormElementWrapper from "../FormElementWrapper/FormElementWrapper";

interface DropzoneProps {
  children: React.ReactNode;
  onFileUpload: (files: Array<File>) => void;
}

const errorCodeMappings: { [key: string]: string } = {
  "file-invalid-type": "File type must be jpeg, png or gif",
  "too-many-files": "Only one file can be uploaded",
};

export default function Dropzone({ children, onFileUpload }: DropzoneProps) {
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

  return (
    <FormElementWrapper
      label="Upload a background image"
      helperText={errorMessage}
      state="danger"
    >
      <ReactDropzone
        onDragOver={() => setDraggedOver(true)}
        onDragLeave={() => setDraggedOver(false)}
        onDropRejected={dropRejected}
        onDropAccepted={dropAccepted}
        accept={{ "image/*": [".jpeg", ".png", ".gif"] }}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={`cursor-default overflow-hidden rounded-lg bg-primary-100/40 hover:text-green-300 ${
              draggedOver && "text-green-300"
            }`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {children}
          </div>
        )}
      </ReactDropzone>
    </FormElementWrapper>
  );
}
