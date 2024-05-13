import "./Dropzone.scss";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";

import * as XLSX from "xlsx";

async function parseSpreadsheet(
  receivedFile: File,
  setExtractedHeaders: Dispatch<SetStateAction<string[]>>
) {
  const fileAsArrayBuffer = await receivedFile.arrayBuffer();
  const workbook = XLSX.read(fileAsArrayBuffer);
  const firstSpreadsheetName = workbook.SheetNames[0];
  const firstSpreadsheet = workbook.Sheets[firstSpreadsheetName];
  const sheetToJson = XLSX.utils.sheet_to_json(firstSpreadsheet);

  const headers: string[] = Object.keys(sheetToJson[0] as []);
  console.log("Headers: ", headers);
  console.log(sheetToJson);
  setExtractedHeaders(headers);
}

export default function CustomDropzone() {
  const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    if (acceptedFiles[0] === undefined) return;
    parseSpreadsheet(acceptedFiles[0], setExtractedHeaders);
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
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="dragAndDropContainer">
          <FaCloudUploadAlt
            color={isDragActive ? "#186e14" : "#3f3244"}
            size={140}
          />
          <p>
            Drag and drop the file or <strong>click here</strong> to open the
            file explorer
          </p>
        </div>
      </div>

      {extractedHeaders.length > 0 ? (
        <>
          <div className="mt-3">
            Extracted headers:
            {extractedHeaders.map((header: string) => {
              return <span key={header}> {header},</span>;
            })}
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
}
