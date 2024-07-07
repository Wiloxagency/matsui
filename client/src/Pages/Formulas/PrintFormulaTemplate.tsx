import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import mLogo from "../../assets/m_logo.png";
import {
  FormulaInterface,
  PigmentInterface,
} from "../../interfaces/interfaces";
import { returnHexColor } from "../../Utilities/returnHexColor";

interface PrintFormulaTemplateProps {
  templateSize: number;
  formula: FormulaInterface;
  fetchedPigments: PigmentInterface[];
}

const columns = [
  {
    key: "componentCode",
    label: "CODE",
  },
  {
    key: "componentDescription",
    label: "ROLE",
  },
  {
    key: "percentage",
    label: "%",
  },
  {
    key: "g",
    label: "Quantity (g)",
  },
];

export default function PrintFormulaTemplate({
  templateSize,
  formula,
  fetchedPigments,
}: PrintFormulaTemplateProps) {
  const mappedComponents = formula.components.map((component) => {
    return {
      FormulaSerie: formula.formulaSeries,
      FormulaCode: formula.formulaCode,
      FormulaDescription: formula.formulaDescription,
      ComponentCode: component.componentCode,
      ComponentDescription: component.componentDescription,
      Percentage: String(component.percentage),
    };
  });

  {
    return templateSize === 1 ? (
      <div className="printFormulaTemplate size1">
        <div className="templateHeader">
          <img src={mLogo} />
          <p>
            <strong>{formula.formulaCode} </strong>({formula.formulaDescription}
            )
          </p>
          <span
            style={{
              marginLeft: "auto",
              fontWeight: "600",
            }}
          >
            1000g
          </span>
          <span
            className="miniSwatch"
            style={{
              backgroundColor: returnHexColor(
                mappedComponents,
                fetchedPigments
              ),
            }}
          ></span>
        </div>
        {/* {formula.formulaDescription} */}

        <Table
          isCompact={mappedComponents.length > 7 ? true : false}
          removeWrapper
          aria-label="Example table with dynamic content"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={formula.components}>
            {(formulaComponent) => (
              <TableRow key={formulaComponent.componentCode}>
                {(columnKey) =>
                  columnKey === "g" ? (
                    <TableCell>
                      <span>
                        {((1000 * formulaComponent.percentage) / 100).toFixed(
                          3
                        )}
                      </span>
                    </TableCell>
                  ) : (
                    <TableCell>
                      {getKeyValue(formulaComponent, columnKey)}
                    </TableCell>
                  )
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    ) : templateSize === 2 ? (
      <div className="printFormulaTemplate size2">SIZE SHOULD BE</div>
    ) : (
      <div className="printFormulaTemplate size3">SIZE SHOULD BE</div>
    );
  }
}
