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
        {formula.components.map((component) => {
          return (
            <span
              key={component.componentCode}
              style={{
                backgroundColor: "#" + component.hex,
                // backgroundColor: color.hex,
                width: component.percentage + "%",
                minWidth: "fit-content",
              }}
            >
              {component.percentage}%
            </span>
          );
        })}
      </div>
    </>
  );
}
