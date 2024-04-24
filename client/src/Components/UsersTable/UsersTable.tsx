import { FaPen } from "react-icons/fa";
import "./UsersTable.scss";
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
    username: "Anthony Hopkins",
    email: "anthopkins@email.com",
    company: "Matsui Color",
    status: "Active",
    registrationDate: "04/01/24",
    createdFormulas: "9",
    lastAccess: "04/01/24",
  },
  {
    key: "2",
    username: "Anthony Hopkins",
    email: "anthopkins@email.com",
    company: "Matsui Color",
    status: "Active",
    registrationDate: "04/01/24",
    createdFormulas: "9",
    lastAccess: "04/01/24",
  },
  {
    key: "3",
    username: "Anthony Hopkins",
    email: "anthopkins@email.com",
    company: "Matsui Color",
    status: "Active",
    registrationDate: "04/01/24",
    createdFormulas: "9",
    lastAccess: "04/01/24",
  },
];

const columns = [
  {
    key: "username",
    label: "USERNAME",
  },
  {
    key: "email",
    label: "EMAIL",
  },
  {
    key: "company",
    label: "COMPANY",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "registrationDate",
    label: "REGISTRATION DATE",
  },
  {
    key: "createdFormulas",
    label: "CREATED FORMULAS",
  },
  {
    key: "lastAccess",
    label: "LAST ACCESS",
  },
];
export default function UsersTable() {
  return (
    <>
      <Table
        color="default"
        selectionMode="multiple"
        defaultSelectedKeys={["1"]}
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
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <table>
        <tbody>
          <tr>
            <th></th>
            <th>USERNAME</th>
            <th>EMAIL</th>
            <th>COMPANY</th>
            <th>STATUS</th>
            <th>REGISTRATION DATE</th>
            <th>FORMULAS CREATED</th>
            <th>LAST ACCESS</th>
            <th></th>
          </tr>
          <tr>
            <td>⭕</td>
            <td>Anthony Hopkins</td>
            <td>anthopkins@email.com</td>
            <td>Matsui Color</td>
            <td>Active</td>
            <td>04/01/24</td>
            <td>10</td>
            <td>04/01/24</td>
            <td>
              <FaPen />
            </td>
          </tr>
          <tr>
            <td>⭕</td>
            <td>Anthony Hopkins</td>
            <td>anthopkins@email.com</td>
            <td>Matsui Color</td>
            <td>Active</td>
            <td>04/01/24</td>
            <td>10</td>
            <td>04/01/24</td>
            <td>
              <FaPen />
            </td>
          </tr>
          <tr>
            <td>⭕</td>
            <td>Anthony Hopkins</td>
            <td>anthopkins@email.com</td>
            <td>Matsui Color</td>
            <td>Active</td>
            <td>04/01/24</td>
            <td>10</td>
            <td>04/01/24</td>
            <td>
              <FaPen />
            </td>
          </tr>
        </tbody>
      </table> */}
    </>
  );
}
