import "./FormulaPercentagesGraph.scss";
import { FormulaInterface } from "../../interfaces/interfaces";

interface FormulaPercentagesGraphProps {
  formula: FormulaInterface;
}

export default function FormulaPercentagesGraph({
  formula,
}: FormulaPercentagesGraphProps) {
  function roundPercentage(receivedPercentage: number) {
    const roundedPercentage: string = Number(receivedPercentage).toFixed(2);
    return Number(roundedPercentage).toPrecision();
  }
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
              {roundPercentage(component.percentage)}%
            </span>
          );
        })}
      </div>
    </>
  );
}
