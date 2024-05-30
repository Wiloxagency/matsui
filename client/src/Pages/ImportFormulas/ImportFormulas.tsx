import "./ImportFormulas.scss";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { useEffect, useState } from "react";
import CustomDropzone from "../../Components/Dropzone/Dropzone";
import { useMediaQuery } from "react-responsive";
import { Button } from "@nextui-org/button";

interface ImportFormulaHeaderColumnIndexesInterface {
  indexFormulaCode: number;
  indexFormulaDescription: number;
  indexComponentCode: number;
  indexComponentDescription: number;
  indexPercentage: number;
}

// TODO: OPTIMIZE THIS LATER. THE LABELS SHOULD BE PART OF AN ARRAY
// OF HEADER OBJECTS 👇🏻
const labels = [
  "FORMULA CODE",
  "FORMULA DESCRIPTION",
  "COMPONENT CODE",
  "COMPONENT DESCRIPTION",
  "COMPONENT PERCENTAGE",
];

export default function ImportFormulas() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [isSwitchSelected, setIsSwitchSelected] = useState(true);
  const [JSONFormulas, setJSONFormulas] = useState<unknown[]>([]);
  const [validationMessage, setValidationMessage] = useState<string>("");

  const [columnIndexes, setColumnIndexes] =
    useState<ImportFormulaHeaderColumnIndexesInterface>({
      indexFormulaCode: 1,
      indexFormulaDescription: 1,
      indexComponentCode: 1,
      indexComponentDescription: 1,
      indexPercentage: 1,
    });

  function handleColumnIndexesChange(value: number, receivedHeader: string) {
    const columnIndexesShallowCopy: ImportFormulaHeaderColumnIndexesInterface =
      columnIndexes;

    columnIndexesShallowCopy[
      receivedHeader as keyof ImportFormulaHeaderColumnIndexesInterface
    ] = value;

    setColumnIndexes(columnIndexesShallowCopy);
  }

  function handleConfirmColumnHeaders() {
    setValidationMessage("");
    const columnValues: number[] = [];
    for (const header of Object.keys(columnIndexes)) {
      columnValues.push(
        columnIndexes[header as keyof ImportFormulaHeaderColumnIndexesInterface]
      );
    }
    const repeatedValues = columnValues.filter(
      (e, i, a) => a.indexOf(e) !== i
    ).length;

    if (repeatedValues > 0) {
      setValidationMessage(
        "All fields must be set. Can't use the same column twice"
      );
      return;
    }
    remapJSONFormulas();
  }

  function remapJSONFormulas() {
    console.log(JSONFormulas);
    console.log("columnIndexes: ", columnIndexes);

    const headers: string[] = Object.keys(JSONFormulas[0] as []);

    const columnsMatchOrder = [4, 5, 1, 2, 3];

    const columnsMatch = {
      FormulaCode: headers[columnsMatchOrder[0] - 1],
      FormulaDescription: headers[columnsMatchOrder[1] - 1],
      ComponentCode: headers[columnsMatchOrder[2] - 1],
      ComponentDescription: headers[columnsMatchOrder[3] - 1],
      Percentage: headers[columnsMatchOrder[4] - 1],
    };

    const transformComponent = (component: any) => {
      const transformed: any = {};
      for (const [newKey, oldKey] of Object.entries(columnsMatch)) {
        transformed[newKey] = component[oldKey];
      }
      return transformed;
    };

    const transformedComponents = JSONFormulas.map(transformComponent);
    console.log("Transformed Components: ", transformedComponents);
  }

  useEffect(() => {
    console.log(columnIndexes);
  }, [columnIndexes]);

  return (
    <>
      <div
        className={
          isMobile ? "importFormulaLayout mobileLayout" : "importFormulaLayout"
        }
      >
        <div className="leftSection">
          <div className="sectionHeader">
            <span>STEP 1: UPLOAD FILE</span>
          </div>
          <div className="card">
            <p className="row">Upload an .xls file containing a series.</p>
            <p className="row">You can only upload one series at a time.</p>
            <p className="row">
              Make sure the spreadsheet contains the following information:
            </p>
            <p className="row">
              Formula code, formula description, component code, component
              description, and component percentage.
            </p>
            <div className="row title">SERIES NAME</div>
            <Input type="text" className="row"></Input>
            <div className="row title">
              DOES THE FIRST ROW CONTAIN THE HEADERS?
            </div>
            <Switch
              className="row"
              isSelected={isSwitchSelected}
              onValueChange={setIsSwitchSelected}
            >
              {isSwitchSelected ? "YES" : "NO"}
            </Switch>
            <CustomDropzone setJSONFormulas={setJSONFormulas} />
          </div>
        </div>
        <div className="rightSection" style={{ minWidth: "350px" }}>
          <div className="formulaDetailsContainer">
            <div className="sectionHeader">
              <span>STEP 2: MATCH THE COLUMNS TO THE CORRESPONDING VALUES</span>
            </div>
            <div className="card">
              <div className="row title">
                <span style={{ flex: "3" }}>HEADER</span>
                <span style={{ flex: "1" }}>COLUMN</span>
              </div>
              {Object.entries(columnIndexes).map(
                ([key, value], indexHeader) => {
                  value;
                  return (
                    <div key={key} className="row">
                      <span style={{ flex: "3" }}>{labels[indexHeader]}</span>
                      <span style={{ flex: "1" }}>
                        <Input
                          type="number"
                          // value={value.toString()}
                          // placeholder={value.toString()}
                          min={1}
                          onValueChange={(inputValue) => {
                            handleColumnIndexesChange(Number(inputValue), key);
                          }}
                        ></Input>
                      </span>
                    </div>
                  );
                }
              )}
              <p
                style={{ color: "red", textAlign: "center" }}
                className={
                  validationMessage !== ""
                    ? "validationErrorMessage active"
                    : "validationErrorMessage"
                }
              >
                {validationMessage}
              </p>
              <Button onPress={handleConfirmColumnHeaders}>Confirm</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
