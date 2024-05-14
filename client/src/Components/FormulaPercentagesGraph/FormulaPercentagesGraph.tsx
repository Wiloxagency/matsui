import "./FormulaPercentagesGraph.scss";
import { FormulaInterface } from "../../interfaces/interfaces";

interface FormulaPercentagesGraphProps {
  formula: FormulaInterface;
}

export default function FormulaPercentagesGraph({
  formula,
}: FormulaPercentagesGraphProps) {
  return (
    <>
      <div className="formulaPercentagesGraphContainer">
        {formula.components.map((color) => {
          return (
            <span
              key={color.componentCode}
              style={{
                backgroundColor: "red",
                // backgroundColor: color.hex,
                width: color.percentage + "%",
                minWidth: "fit-content",
              }}
            >
              {color.percentage}%
            </span>
          );
        })}
      </div>
    </>
  );
}
