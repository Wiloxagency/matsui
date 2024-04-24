import { useState } from "react";
import "./Swatches.scss";
import { formulas } from "./tempFormulas";

export interface FormulaInterface {
  hex: string;
  title: string;
  description: string;
  contents: {
    code: string;
    product: string;
    percentage: number;
  }[];
}

export default function Swatches() {
  const [selectedFormula, setSelectedFormula] = useState({
    hex: "#001489",
    title: "Reflex Blue C",
    description: "DC NEO Reflex Blue C",
    contents: [
      {
        code: "",
        product: "",
        percentage: 100,
      },
    ],
  });

  function handleClick(clickedFormula: FormulaInterface) {
    setSelectedFormula(clickedFormula);
  }

  return (
    <>
      <div className="swatchesContainer">
        {formulas.map((formula) => {
          return (
            <span
              key={formula.hex}
              className={
                formula.hex === selectedFormula.hex ? "swatch active" : "swatch"
              }
              style={{ backgroundColor: formula.hex }}
              onClick={() => handleClick(formula)}
            >
              <div className="swatchLabelContainer">
                <div className="swatchTitle">285 C</div>
                <div>DC NEO 285 C</div>
              </div>
            </span>
          );
        })}
      </div>
    </>
  );
}
