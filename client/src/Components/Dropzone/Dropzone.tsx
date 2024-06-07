import { Dispatch, SetStateAction, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./Dropzone.scss";

import * as XLSX from "xlsx";

async function parseSpreadsheet(
  receivedFile: File,
  setExtractedHeaders: Dispatch<SetStateAction<string[]>>,
  // setTransformedComponents: Dispatch<SetStateAction<any[]>>,
  setJSONFormulas: Dispatch<SetStateAction<unknown[]>>
) {
  const fileAsArrayBuffer = await receivedFile.arrayBuffer();
  const workbook = XLSX.read(fileAsArrayBuffer);
  const firstSpreadsheetName = workbook.SheetNames[0];
  const firstSpreadsheet = workbook.Sheets[firstSpreadsheetName];
  const sheetToJson = XLSX.utils.sheet_to_json(firstSpreadsheet);
  setJSONFormulas(sheetToJson);

  const headers: string[] = Object.keys(sheetToJson[0] as []);

  setExtractedHeaders(headers);
}

interface CustomDropzonePropsInterface {
  setJSONFormulas: Dispatch<SetStateAction<unknown[]>>;
  setExtractedHeaders: Dispatch<SetStateAction<string[]>>;
}

export default function CustomDropzone({
  setJSONFormulas,
  setExtractedHeaders,
}: CustomDropzonePropsInterface) {
  // const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    if (acceptedFiles[0] === undefined) return;
    parseSpreadsheet(
      acceptedFiles[0],
      setExtractedHeaders,
      // setTransformedComponents,
      setJSONFormulas
    );
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
    </>
  );
}
