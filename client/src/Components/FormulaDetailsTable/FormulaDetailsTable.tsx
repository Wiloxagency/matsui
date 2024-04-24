import "./FormulaDetailsTable.scss";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";

const rows = [
  {
    key: "1",
    hex: "#b5b6b9",
    code: "HM DC Base",
    product: "High mesh discharge base",
    percentage: "97.2940",
    quantity: "972.9400 g",
    price: "0.97 $",
  },
  {
    key: "2",
    hex: "#0066b0",
    code: "HM DC Base",
    product: "High mesh discharge base",
    percentage: "97.2940",
    quantity: "972.9400 g",
    price: "0.97 $",
  },
  {
    key: "3",
    hex: "#654285",
    code: "HM DC Base",
    product: "High mesh discharge base",
    percentage: "97.2940",
    quantity: "972.9400 g",
    price: "0.97 $",
  },
  {
    key: "4",
    hex: "#3e3d39",
    code: "HM DC Base",
    product: "High mesh discharge base",
    percentage: "97.2940",
    quantity: "972.9400 g",
    price: "0.97 $",
  },
];

const columns = [
  {
    key: "hex",
    label: "",
  },
  {
    key: "code",
    label: "CODE",
  },
  {
    key: "product",
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

export default function FormulaDetailsTable() {
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
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey !== "hex" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <span
                      className="miniSwatch"
                      style={{ backgroundColor: item.hex }}
                    ></span>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
