interface PrintFormulaTemplateProps {
  templateSize: number;
}

export default function PrintFormulaTemplate({
  templateSize,
}: PrintFormulaTemplateProps) {
  return (
    <div
      className={
        templateSize === 1
          ? "printFormulaTemplate templateSize1"
          : templateSize === 2
          ? "printFormulaTemplate templateSize2"
          : "printFormulaTemplate templateSize3"
      }
    >
      SIZE SHOULD BE
      {templateSize === 1
        ? " 7 x 4.5 in"
        : templateSize === 2
        ? " 3.5 x 2.25"
        : " 2.5 x 1.5"}
    </div>
  );
}
