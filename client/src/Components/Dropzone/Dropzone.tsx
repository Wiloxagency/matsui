import "./Dropzone.scss";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";

import * as XLSX from "xlsx";

async function parseSpreadsheet(receivedFile: File) {
  const fileAsArrayBuffer = await receivedFile.arrayBuffer();
  const workbook = XLSX.read(fileAsArrayBuffer);
  const firstSpreadsheetName = workbook.SheetNames[0];
  const firstSpreadsheet = workbook.Sheets[firstSpreadsheetName];
  const sheetToJson = XLSX.utils.sheet_to_json(firstSpreadsheet);
  console.log(sheetToJson);
}

export default function CustomDropzone() {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    if (acceptedFiles[0] === undefined) return;
    parseSpreadsheet(acceptedFiles[0]);
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
