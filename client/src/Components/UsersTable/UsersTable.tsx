import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Dispatch, SetStateAction } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { UserInterface } from "../../interfaces/interfaces";
import "./UsersTable.scss";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
// } from "@nextui-org/table";

import { Checkbox } from "@nextui-org/checkbox";
import { useMediaQuery } from "react-responsive";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "../../../node_modules/react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

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
    label: "REGISTRATION",
  },
  {
    key: "createdFormulas",
    label: "FORMULAS",
  },
  {
    key: "lastAccess",
    label: "LAST ACCESS",
  },
  {
    key: "actions",
    label: "",
  },
];

interface UsersTableProps {
  users: UserInterface[];
  selectedRowsIds: Set<string>;
  setSelectedRowsIds: Dispatch<SetStateAction<Set<string>>>;
  indexRowToEdit: number | null;
  handleEditRow: (userId: string) => void;
  
  // setIndexRowToEdit: Dispatch<SetStateAction<number | null>>;
}

export default function UsersTable({
  users,
  // selectedRowsIds,
  // setSelectedRowsIds,
  // indexRowToEdit,

  // setIndexRowToEdit,
  handleEditRow,
}: UsersTableProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <>
      <Table className="usersTable">
        <Thead>
          <Tr>
            <Th></Th>
            {columns.map((columnHeader) => {
              return <Th key={columnHeader.key}>{columnHeader.label}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => {
            return (
              <Tr key={user._id}>
                <Td>
                  <Checkbox></Checkbox>
                </Td>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.company}</Td>
                <Td>{user.status}</Td>
                <Td>{user.registrationDate}</Td>
                <Td>{user.createdFormulas}</Td>
                <Td>{user.lastAccess}</Td>
                <Td>
                  {isMobile ? (
                    <Button
                      color="primary"
                      onPress={() => handleEditRow(user._id)}
                    >
                      Edit user
                    </Button>
                  ) : (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <FaEllipsisV />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="dropdown">
                        <DropdownItem onClick={() => handleEditRow(user._id)}>
                          Edit
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {/* <Table
        color="default"
        selectionMode="multiple"
        aria-label="Example static collection table"
        isHeaderSticky
        removeWrapper
        selectedKeys={selectedRowsIds}
        onSelectionChange={(keys) => setSelectedRowsIds(keys as Set<string>)}
        topContent={
          <>
            <div>INDEX ROW TO EDIT: {indexRowToEdit}</div>
            <div>SELECTED ROWS IDS: {selectedRowsIds.size}</div>
            <div>
              {selectedRowsIds.size ? (
                [...selectedRowsIds].map((rowId) => {
                  if (rowId.length > 0)
                    return <span key={rowId}>{rowId}, </span>;
                })
              ) : (
                <></>
              )}
            </div>
          </>
        }
        classNames={{
          // base: "overflow-scroll",
          base: "max-h-[35vh] overflow-scroll",
          // table: "min-h-[420px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={users} emptyContent={<Spinner />}>
          {(user: UserInterface) => (
            <TableRow key={user._id}>
              {(columnKey) => (
                <TableCell>{renderCell(user, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table> */}
    </>
  );
}
