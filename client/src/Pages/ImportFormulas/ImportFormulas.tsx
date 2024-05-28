import "./ImportFormulas.scss";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { useEffect, useState } from "react";
import CustomDropzone from "../../Components/Dropzone/Dropzone";
import { useMediaQuery } from "react-responsive";
import { Button } from "@nextui-org/button";

interface ImportFormulaHeaderColumnIndexesInterface {
  indexComponentCode: number;
  indexComponentDescription: number;
  indexFormulaCode: number;
  indexFormulaDescription: number;
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

  const [columnIndexes, setColumnIndexes] =
    useState<ImportFormulaHeaderColumnIndexesInterface>({
      indexComponentCode: 0,
      indexComponentDescription: 1,
      indexFormulaCode: 2,
      indexFormulaDescription: 3,
      indexPercentage: 4,
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
    console.log(columnIndexes);
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
            <CustomDropzone />
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
                  return (
                    <div key={key} className="row">
                      <span style={{ flex: "3" }}>{labels[indexHeader]}</span>
                      <span style={{ flex: "1" }}>
                        <Input
                          type="number"
                          placeholder={(value + 1).toString()}
                          min={0}
                          onValueChange={(inputValue) => {
                            handleColumnIndexesChange(
                              Number(inputValue),
                              "indexFormulaCode"
                            );
                          }}
                        ></Input>
                      </span>
                    </div>
                  );
                }
              )}
              <Button onPress={handleConfirmColumnHeaders}>Confirm</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
