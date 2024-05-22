import { Dispatch, SetStateAction } from "react";
import "./Swatches.scss";
// import returnTemporaryFormulas from "./TempFormulas";
import {
  FormulaInterface,
  FormulaSwatchInterface,
  // FormulaSwatchInterface,
} from "../../interfaces/interfaces";
// import { formulaColors, formulaNames } from "../../State/formulaNames";
import { api } from "../../State/api";

interface SwatchesProps {
  // formulas: FormulaSwatchInterface[] | undefined;
  formulaSwatches: FormulaSwatchInterface[] | undefined;
  selectedFormula: FormulaInterface | undefined;
  setSelectedFormula: Dispatch<SetStateAction<FormulaInterface | undefined>>;
  selectedSeries: string;
}

// function returnHexColorBasedOnFormulaName(formulaName: string): string {
//   const indexFormula = formulaNames.findIndex(
//     (formula) => formulaName.toLowerCase() === formula.toLowerCase()
//   );
//   const colorFormula = "#" + formulaColors[indexFormula];
//   return colorFormula;
// }

export default function Swatches({
  formulaSwatches,
  setSelectedFormula,
  selectedFormula,
  selectedSeries,
}: SwatchesProps) {
  const [trigger, { data }] = api.endpoints.getFormulaComponents.useLazyQuery();
  data;

  function handleSelectFormula(clickedFormula: string) {
    trigger({
      formulaSeries: selectedSeries,
      formulaCode: clickedFormula.toUpperCase(),
    }).then((response) => {
      // console.log("response: ", response.data);
      // console.log("data: ", data);

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

  if (formulaSwatches !== undefined)
    return (
      <>
        <div className="swatchesContainer">
          {formulaSwatches.map((formulaSwatch) => {
            return (
              <span
                key={formulaSwatch.formulaCode}
                className={
                  formulaSwatch.formulaCode === selectedFormula?.formulaCode
                    ? "swatch active"
                    : "swatch"
                }
                style={{
                  backgroundColor: "#" + formulaSwatch.formulaColor,
                }}
                onClick={() => handleSelectFormula(formulaSwatch.formulaCode)}
              >
                <div className="swatchLabelContainer">
                  <div className="swatchTitle">{formulaSwatch.formulaCode}</div>
                  {/* <div>{formula.formulaDescription}</div> */}
                </div>
              </span>
            );
          })}
        </div>
      </>
    );
}
