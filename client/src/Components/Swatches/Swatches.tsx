import { Dispatch, SetStateAction } from "react";
import "./Swatches.scss";
// import returnTemporaryFormulas from "./TempFormulas";
import { FormulaInterface } from "../../interfaces/interfaces";

interface SwatchesProps {
  formulas: FormulaInterface[] | undefined;
  selectedFormula: FormulaInterface | undefined;
  setSelectedFormula: Dispatch<SetStateAction<FormulaInterface | undefined>>;
}

export default function Swatches({
  formulas,
  setSelectedFormula,
  selectedFormula,
}: SwatchesProps) {
  function handleClick(clickedFormula: FormulaInterface) {
    setSelectedFormula(clickedFormula);
  }

  if (formulas !== undefined)
    return (
      <>
        <div className="swatchesContainer">
          {formulas.map((formula: FormulaInterface) => {
            return (
              <span
                key={formula.formulaCode}
                className={
                  formula.formulaCode === selectedFormula?.formulaCode
                    ? "swatch active"
                    : "swatch"
                }
                style={{ backgroundColor: "#000" }}
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
