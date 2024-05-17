import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { FormulaInterface } from "../../interfaces/interfaces";
import "./FormulaDetailsTable.scss";
import React from "react";

// const rows = [
//   {
//     key: "1",
//     hex: "#b5b6b9",
//     code: "HM DC Base",
//     product: "High mesh discharge base",
//     percentage: "97.2940",
//     quantity: "972.9400 g",
//     price: "0.97 $",
//   },
//   {
//     key: "2",
//     hex: "#0066b0",
//     code: "HM DC Base",
//     product: "High mesh discharge base",
//     percentage: "97.2940",
//     quantity: "972.9400 g",
//     price: "0.97 $",
//   },
//   {
//     key: "3",
//     hex: "#654285",
//     code: "HM DC Base",
//     product: "High mesh discharge base",
//     percentage: "97.2940",
//     quantity: "972.9400 g",
//     price: "0.97 $",
//   },
//   {
//     key: "4",
//     hex: "#3e3d39",
//     code: "HM DC Base",
//     product: "High mesh discharge base",
//     percentage: "97.2940",
//     quantity: "972.9400 g",
//     price: "0.97 $",
//   },
// ];

const columns = [
  {
    key: "hex",
    label: "",
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

type TableComponent = {
  componentCode: string;
  componentDescription: string;
  percentage: number;
  hex?: string;
};

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
  // const givenComponentsList = formula.components.map(({ componentCode }) => {
  //   return componentCode;
  // });
  // const { data: fetchedComponents } = useGetGivenComponentsQuery(givenComponentsList);

  const renderCell = React.useCallback(
    (component: TableComponent, columnKey: React.Key) => {
      const cellValue = component[columnKey as keyof TableComponent];

      switch (columnKey) {
        case "hex":
          return (
            <>
              <span
                className="miniSwatch"
                style={{ backgroundColor: "#" + component.hex }}
              ></span>
            </>
          );
        case "quantity":
          return (
            <div>
              {(formulaQuantity * component.percentage) / 100} {formulaUnit}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [formulaQuantity, formulaUnit]
  );

  return (
    <>
      <Table
        color="default"
        aria-label="Example static collection table"
        removeWrapper
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={formula.components}>
          {(component) => (
            <TableRow key={component.componentCode}>
              {(columnKey) => (
                <TableCell>{renderCell(component, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
