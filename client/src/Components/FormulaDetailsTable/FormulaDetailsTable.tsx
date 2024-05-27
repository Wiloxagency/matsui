import "./FormulaDetailsTable.scss";
import { FormulaInterface } from "../../interfaces/interfaces";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
// } from "@nextui-org/table";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "../../../node_modules/react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

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

// type TableComponent = {
//   componentCode: string;
//   componentDescription: string;
//   percentage: number;
//   hex?: string;
// };

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

  // const renderCell = React.useCallback(
  //   (component: TableComponent, columnKey: React.Key) => {
  //     const cellValue = component[columnKey as keyof TableComponent];

  //     switch (columnKey) {
  //       case "hex":
  //         return (
  //           <>
  //             <span
  //               className="miniSwatch"
  //               style={{ backgroundColor: "#" + component.hex }}
  //             ></span>
  //           </>
  //         );
  //       case "quantity":
  //         return (
  //           <div>
  //             {(formulaQuantity * component.percentage) / 100} {formulaUnit}
  //           </div>
  //         );
  //       default:
  //         return cellValue;
  //     }
  //   },
  //   [formulaQuantity, formulaUnit]
  // );

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
                  <span
                    className="miniSwatch"
                    style={{ backgroundColor: "#" + component.hex }}
                  ></span>
                </Td>
                <Td>{component.componentCode}</Td>
                <Td>{component.componentDescription}</Td>
                <Td>{component.percentage}</Td>
                <Td>
                  {(formulaQuantity * component.percentage) / 100} {formulaUnit}
                </Td>
                <Td>0.00</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {/* <Table
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
      </Table> */}
    </>
  );
}
