import "./FormulaPercentagesGraph.scss";

export default function FormulaPercentagesGraph() {
  let formulaColors = [
    { hex: "#000000", percentage: 50 },
    { hex: "#ffffff", percentage: 25 },
    { hex: "#555555", percentage: 25 },
  ];
  return (
    <>
      <div className="formulaPercentagesGraphContainer">
        {formulaColors.map((color) => {
          return (
            <span
              key={color.hex}
              style={{
                backgroundColor: color.hex,
                width: color.percentage + "%",
              }}
            >
              sup
            </span>
          );
        })}
      </div>
    </>
  );
}
