import "./FormulaPercentagesGraph.scss";

export default function FormulaPercentagesGraph() {
  const formulaColors = [
    { hex: "#0066b0", percentage: 50 },
    { hex: "#654285", percentage: 25 },
    { hex: "#3e3d39", percentage: 25 },
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
            ></span>
          );
        })}
      </div>
    </>
  );
}
