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
  formula: FormulaInterface;
  fetchedPigments?: PigmentInterface[];
  templateSize?: number;
}

const columns = [
  {
    key: "componentCode",
    label: "CODE",
  },
  {
    key: "componentDescription",
    label: "PRODUCT",
  },
  {
    key: "percentage",
    label: "%",
  },
  {
    key: "g",
    label: "QUANTITY (g)",
  },
];

function returnMappedComponents(receivedFormula: FormulaInterface) {
  const mappedComponents = receivedFormula.components.map((component) => {
    return {
      FormulaSerie: receivedFormula.formulaSeries,
      FormulaCode: receivedFormula.formulaCode,
      FormulaDescription: receivedFormula.formulaDescription,
      ComponentCode: component.componentCode,
      ComponentDescription: component.componentDescription,
      Percentage: String(component.percentage),
    };
  });
  return mappedComponents;
}

function TemplateTable({ formula }: PrintFormulaTemplateProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>CODE</th>
          <th>PRODUCT</th>
          <th>%</th>
          <th>QUANTITY (g)</th>
        </tr>
      </thead>
      <tbody>
        {formula.components.map((component) => {
          return (
            <tr key={component.componentCode}>
              <td>{component.componentCode}</td>
              <td>{component.componentDescription}</td>
              <td>{component.percentage}</td>
              <td>{((1000 * component.percentage) / 100).toFixed(3)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TemplateHeader({
  formula,
  fetchedPigments,
}: PrintFormulaTemplateProps) {
  return (
    <div className="templateHeader">
      <img src={mLogo} />
      <p>
        <strong>{formula.formulaCode} </strong>({formula.formulaDescription})
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
            returnMappedComponents(formula),
            fetchedPigments!
          ),
        }}
      ></span>
    </div>
  );
}

export default function PrintFormulaTemplate({
  templateSize,
  formula,
  fetchedPigments,
}: PrintFormulaTemplateProps) {
  {
    return templateSize === 1 ? (
      <div className="printFormulaTemplate size1">
        <TemplateHeader
          formula={formula}
          fetchedPigments={fetchedPigments}
          templateSize={templateSize}
        />
        <Table
          isCompact={formula.components.length > 7 ? true : false}
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
      <div className="printFormulaTemplate size2">
        <TemplateHeader
          formula={formula}
          fetchedPigments={fetchedPigments}
          templateSize={templateSize}
        />
        <TemplateTable formula={formula} />
      </div>
    ) : (
      <div className="printFormulaTemplate size3">
        <TemplateHeader
          formula={formula}
          fetchedPigments={fetchedPigments}
          templateSize={templateSize}
        />
        <TemplateTable formula={formula} />
      </div>
    );
  }
}
