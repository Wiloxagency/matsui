import { Dispatch, SetStateAction } from "react";
import "./Swatches.scss";
// import returnTemporaryFormulas from "./TempFormulas";
import {
  FormulaInterface,
  // FormulaSwatchInterface,
} from "../../interfaces/interfaces";
import { formulaColors, formulaNames } from "../../State/formulaNames";
import { api } from "../../State/api";

interface SwatchesProps {
  // formulas: FormulaSwatchInterface[] | undefined;
  formulas: string[] | undefined;
  selectedFormula: FormulaInterface | undefined;
  setSelectedFormula: Dispatch<SetStateAction<FormulaInterface | undefined>>;
  selectedSeries: string;
}

function returnHexColorBasedOnFormulaName(formulaName: string): string {
  const indexFormula = formulaNames.findIndex(
    (formula) => formulaName.toLowerCase() === formula.toLowerCase()
  );
  const colorFormula = "#" + formulaColors[indexFormula];
  return colorFormula;
}

export default function Swatches({
  formulas,
  setSelectedFormula,
  selectedFormula,
  selectedSeries,
}: SwatchesProps) {
  
  const [trigger, { data }] = api.endpoints.getFormulaComponents.useLazyQuery();

  function handleSelectFormula(clickedFormula: string) {
    trigger({
      formulaSeries: selectedSeries,
      formulaCode: clickedFormula,
    }).then((response) => {
      console.log("response: ", response.data);
      console.log("data: ", data);

      if (response.data === undefined) return;

      const fullFormula: FormulaInterface = {
        formulaSeries: selectedSeries,
        formulaCode: clickedFormula,
        formulaDescription: "",
        isActive: true,
        reportedAsError: false,
        inkSystem: "",
        components: response.data.components,
      };
      setSelectedFormula(fullFormula);
    });
  }

  if (formulas !== undefined)
    return (
      <>
        <div className="swatchesContainer">
          {formulas.map((formulaCode: string) => {
            return (
              <span
                key={formulaCode}
                className={
                  formulaCode === selectedFormula?.formulaCode
                    ? "swatch active"
                    : "swatch"
                }
                style={{
                  backgroundColor:
                    returnHexColorBasedOnFormulaName(formulaCode),
                }}
                onClick={() => handleSelectFormula(formulaCode)}
              >
                <div className="swatchLabelContainer">
                  <div className="swatchTitle">{formulaCode}</div>
                  {/* <div>{formula.formulaDescription}</div> */}
                </div>
              </span>
            );
          })}
        </div>
      </>
    );
}
