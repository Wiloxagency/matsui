import "./FormulaDetailsTable.scss";
import { FormulaInterface } from "../../interfaces/interfaces";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "../../../node_modules/react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useGetPigmentsQuery } from "../../State/api";

const columns = [
  {
    key: "hex",
    label: "hex",
  },
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
    key: "quantity",
    label: "QUANTITY",
  },
  {
    key: "price",
    label: "PRICE",
  },
];

interface FormulaDetailsTableProps {
  formula: FormulaInterface;
  formulaQuantity: number;
  formulaUnit: "g" | "kg" | "lb" | string;
}

export default function FormulaDetailsTable({
  formula,
  formulaQuantity,
  formulaUnit,
}: FormulaDetailsTableProps) {
  const { data: fetchedPigments } = useGetPigmentsQuery();

  function returnComponentPrice(receivedComponentCode: string) {
    const selectedPigment = fetchedPigments?.filter(
      (pigment) => pigment.code === receivedComponentCode
    );
    if (selectedPigment && selectedPigment.length > 0) {
      return selectedPigment[0].pricePerKg;
    }
    return "❌";
  }

  return (
    <>
      <Table className="usersTable">
        <Thead>
          <Tr>
            {columns.map((columnHeader) => {
              return (
                <Th key={columnHeader.key}>
                  {columnHeader.key !== "hex" ? columnHeader.label : ""}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {formula.components.map((component) => {
            return (
              <Tr key={component.componentCode}>
                <Td>
                  {component.hex ? (
                    <span
                      className="miniSwatch"
                      style={{ backgroundColor: "#" + component.hex }}
                    ></span>
                  ) : (
                    "❌"
                  )}
                </Td>
                <Td>{component.componentCode}</Td>
                <Td>{component.componentDescription}</Td>
                <Td>{component.percentage}</Td>
                <Td>
                  {(formulaQuantity * component.percentage) / 100} {formulaUnit}
                </Td>
                <Td>{returnComponentPrice(component.componentCode)}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}
