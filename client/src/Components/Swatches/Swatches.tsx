import { Dispatch, SetStateAction } from "react";
import "./Swatches.scss";
import {
  FormulaInterface,
  GetFormulasResultInterface,
} from "../../interfaces/interfaces";
import { FaPen } from "react-icons/fa";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";

interface SwatchesProps {
  formulas: GetFormulasResultInterface[] | undefined;
  selectedFormula: FormulaInterface | undefined;
  setSelectedFormula: Dispatch<SetStateAction<FormulaInterface | undefined>>;
  selectedSeries: string;
  triggerGetSimilarFormulas: (value: {
    formulaCode: string;
    formulaSeries: string;
  }) => void;
  handleEditOrCreateFormulaClick?: (value: "edit") => void;
}

export default function Swatches({
  formulas,
  setSelectedFormula,
  selectedFormula,
  selectedSeries,
  triggerGetSimilarFormulas,
  handleEditOrCreateFormulaClick,
}: SwatchesProps) {
  function handleSelectFormula(clickedFormula: GetFormulasResultInterface) {
    // console.log(clickedFormula);
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
    if (triggerGetSimilarFormulas) {
      triggerGetSimilarFormulas({
        formulaCode: clickedFormula._id,
        formulaSeries: selectedSeries,
      });
    }
  }

  function handleEditFormula(clickedFormula: GetFormulasResultInterface) {
    handleSelectFormula(clickedFormula);
    if (handleEditOrCreateFormulaClick) handleEditOrCreateFormulaClick("edit");
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
                  backgroundColor:
                    "#" + formula.formulaSwatchColor.formulaColor,
                }}
                onClick={() => handleSelectFormula(formula)}
              >
                <div className="swatchLabelContainer">
                  <div className="swatchTitle">{formula._id}</div>
                  {/* <div>{formula.formulaDescription}</div> */}
                </div>
                {formula.formulaSwatchColor.createdBy && (
                  <Tooltip content="This formula is editable">
                    <Button
                      className="editSwatchButton"
                      isIconOnly={true}
                      size="sm"
                      variant="solid"
                      onPress={() => handleEditFormula(formula)}
                    >
                      <FaPen></FaPen>
                    </Button>
                  </Tooltip>
                )}
              </span>
            );
          })}
        </div>
      </>
    );
}
