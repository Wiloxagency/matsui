import "./Dropzone.scss";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function MyDropzone() {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    console.log(acceptedFiles[0]);

    const file = new FileReader();
    file.onload = function () {};
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.ms-exce": [".xls"],
        "application/vnd.ms-excel": [".xlsx"],
    },
    maxFiles: 1,
    // 10 mb 👇🏻
    maxSize: 10000000,
    multiple: false,
    onDrop,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <div className="dragAndDropContainer">
        <FaCloudUploadAlt
          color={isDragActive ? "#186e14" : "#3f3244"}
          size={140}
        />
        <p>
          Drag and drop the file or <strong>click here</strong> to open the file
          explorer
        </p>
      </div>
    </div>
  );
}
