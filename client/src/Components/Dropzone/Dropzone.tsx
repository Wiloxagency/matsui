import { Dispatch, SetStateAction, useCallback, useState } from "react";
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

  // Temporal binding replacement
  // const columnsMatchOrder = [4, 5, 1, 2, 3];

  const headers: string[] = Object.keys(sheetToJson[0] as []);
  // console.log("Headers: ", headers);

  // const columnsMatch = {
  //   FormulaCode: headers[columnsMatchOrder[0] - 1],
  //   FormulaDescription: headers[columnsMatchOrder[1] - 1],
  //   ComponentCode: headers[columnsMatchOrder[2] - 1],
  //   ComponentDescription: headers[columnsMatchOrder[3] - 1],
  //   Percentage: headers[columnsMatchOrder[4] - 1],
  // };

  // console.log(sheetToJson);
  setExtractedHeaders(headers);

  // const transformComponent = (component: any) => {
  //   const transformed: any = {};
  //   for (const [newKey, oldKey] of Object.entries(columnsMatch)) {
  //     transformed[newKey] = component[oldKey];
  //   }
  //   return transformed;
  // };

  // const transformedComponents = sheetToJson.map(transformComponent);
  // console.log("Transformed Components: ", transformedComponents);
  // setTransformedComponents(transformedComponents);
}

interface CustomDropzonePropsInterface {
  // JSONFormulas: unknown[];
  setJSONFormulas: Dispatch<SetStateAction<unknown[]>>;
}

export default function CustomDropzone({
  setJSONFormulas,
}: CustomDropzonePropsInterface) {
  const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);
  // const [transformedComponents, setTransformedComponents] = useState<any[]>([]);
  // transformedComponents;

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    // setJSONFormulas([1, 2, 3]);

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
