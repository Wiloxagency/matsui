import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "../../../node_modules/react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useGetPigmentsQuery } from "../../State/api";
import { FormulaInterface } from "../../interfaces/interfaces";
import "./FormulaDetailsTable.scss";
import { Dispatch, SetStateAction } from "react";

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
  totalFormulaCost: number;
  setTotalFormulaCost: Dispatch<SetStateAction<number>>;
}

export default function FormulaDetailsTable({
  formula,
  formulaQuantity,
  formulaUnit,
  totalFormulaCost,
  setTotalFormulaCost,
}: FormulaDetailsTableProps) {
  const { data: fetchedPigments } = useGetPigmentsQuery();

  function updateTotalFormulaCost(receivedComponentCost: number) {
    setTotalFormulaCost(totalFormulaCost + receivedComponentCost);
  }

  function returnComponentPrice(receivedComponent: {
    componentCode: string;
    componentDescription: string;
    percentage: number;
  }) {
    console.log(receivedComponent);
    const selectedPigment = fetchedPigments?.filter(
      (pigment) => pigment.code === receivedComponent.componentCode
    );
    if (selectedPigment && selectedPigment.length > 0) {
      const componentWeight = formulaQuantity * receivedComponent.percentage;
      const componentPrice =
        (componentWeight * selectedPigment[0].pricePerKg) / 1000;

      updateTotalFormulaCost(componentPrice);
      return componentPrice;
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
                <Td>{returnComponentPrice(component)}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}
