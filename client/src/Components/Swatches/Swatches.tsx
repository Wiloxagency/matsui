import { Dispatch, SetStateAction } from "react";
import "./Swatches.scss";
// import returnTemporaryFormulas from "./TempFormulas";
import {
  FormulaInterface,
  FormulaSwatchInterface,
} from "../../interfaces/interfaces";
import { formulaColors, formulaNames } from "../../State/formulaNames";
import { api } from "../../State/api";

interface SwatchesProps {
  formulas: FormulaSwatchInterface[] | undefined;
  selectedFormula: FormulaInterface | undefined;
  setSelectedFormula: Dispatch<SetStateAction<FormulaInterface | undefined>>;
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
}: SwatchesProps) {
  const [trigger, { data }] = api.endpoints.getFormula.useLazyQuery();

  function handleClick(clickedFormula: FormulaSwatchInterface) {
    trigger({
      formulaSeries: clickedFormula.formulaSeries,
      formulaCode: clickedFormula.formulaCode,
    }).then((response) => {
      console.log("response: ", response.data);
      console.log("data: ", data);

      if (response.data === undefined) return;

      const fullFormula: FormulaInterface = {
        formulaSeries: "",
        formulaCode: "",
        formulaDescription: "",
        isActive: true,
        reportedAsError: false,
        inkSystem: "",
        components: response.data.components,
      };
      setSelectedFormula(fullFormula);
    });

    //   trigger({
    //     formulaSeries: clickedFormula.formulaSeries,
    //     formulaCode: clickedFormula.formulaCode,
    //   }).then(
    //     data => {
    //     console.log("data: ", data);

    //     if (data !== undefined) {
    //       const fullFormula: FormulaInterface = {
    //         formulaSeries: "",
    //         formulaCode: "",
    //         formulaDescription: "",
    //         isActive: true,
    //         reportedAsError: false,
    //         inkSystem: "",
    //         components: data.components,
    //       };
    //       setSelectedFormula(fullFormula);
    //     }
    //   }
    // );
  }

  if (formulas !== undefined)
    return (
      <>
        <div className="swatchesContainer">
          {formulas.map((formula: FormulaSwatchInterface) => {
            return (
              <span
                key={formula.formulaCode}
                className={
                  formula.formulaCode === selectedFormula?.formulaCode
                    ? "swatch active"
                    : "swatch"
                }
                style={{
                  backgroundColor: returnHexColorBasedOnFormulaName(
                    formula.formulaCode
                  ),
                }}
                // style={{ backgroundColor: formula.hex }}
                onClick={() => handleClick(formula)}
              >
                <div className="swatchLabelContainer">
                  <div className="swatchTitle">{formula.formulaCode}</div>
                  <div>{formula.formulaDescription}</div>
                </div>
              </span>
            );
          })}
        </div>
      </>
    );
}
