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
  const isAdmin = localStorage.getItem("isAdmin");
  const userCompany = localStorage.getItem("userCompany");
  console.log("userCompany: ", userCompany);

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
      createdBy: clickedFormula.formulaSwatchColor.createdBy,
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

  function isFormulaEditableByUser(
    formula: GetFormulasResultInterface
  ): boolean {
    if (formula.formulaSwatchColor.createdBy && isAdmin) return true;

    if (
      formula.formulaSwatchColor.createdBy &&
      userCompany === formula.formulaSwatchColor.company
    )
      return true;
    return false;
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
                {isFormulaEditableByUser(formula) && (
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
