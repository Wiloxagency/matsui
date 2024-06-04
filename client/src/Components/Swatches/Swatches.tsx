import { Dispatch, SetStateAction } from "react";
import "./Swatches.scss";
// import returnTemporaryFormulas from "./TempFormulas";
import {
  FormulaInterface,
  GetFormulasResultInterface,
} from "../../interfaces/interfaces";
import { returnHexColor } from "../../Utilities/returnHexColor";

interface SwatchesProps {
  formulas: GetFormulasResultInterface[] | undefined;
  selectedFormula: FormulaInterface | undefined;
  setSelectedFormula: Dispatch<SetStateAction<FormulaInterface | undefined>>;
  selectedSeries: string;
}

export default function Swatches({
  formulas,
  setSelectedFormula,
  selectedFormula,
  selectedSeries,
}: SwatchesProps) {
  function handleSelectFormula(clickedFormula: GetFormulasResultInterface) {
    console.log(clickedFormula);

    const fullFormula: FormulaInterface = {
      formulaSeries: selectedSeries,
      formulaCode: clickedFormula._id,
      formulaDescription: clickedFormula.formulaDescription,
      isActive: true,
      reportedAsError: false,
      inkSystem: "",
      components: clickedFormula.components,
    };
    setSelectedFormula(fullFormula);
  }

  if (formulas !== undefined)
    return (
      <>
        <div className="swatchesContainer">
          {formulas.map((formula) => {
            return (
              <span
                key={formula._id}
                className={
                  formula._id === selectedFormula?.formulaCode
                    ? "swatch active"
                    : "swatch"
                }
                style={{
                  backgroundColor: returnHexColor(formula.components),
                }}
                onClick={() => handleSelectFormula(formula)}
              >
                <div className="swatchLabelContainer">
                  <div className="swatchTitle">{formula._id}</div>
                  {/* <div>{formula.formulaDescription}</div> */}
                </div>
              </span>
            );
          })}
        </div>
      </>
    );
}
