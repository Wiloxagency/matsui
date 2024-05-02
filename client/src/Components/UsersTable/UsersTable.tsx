import { FaEllipsisV } from "react-icons/fa";
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
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { UserInterface } from "../../interfaces/interfaces";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import TextInput from "./temp";

const API_URL = import.meta.env.VITE_API_URL;

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
  {
    key: "actions",
    label: "",
  },
];

export default function UsersTable({ users }: { users: UserInterface[] }) {
  // useEffect(() => {
  //   axios
  //     .get(API_URL + "users", {
  //       headers: { "Content-type": "application/json" },
  //     })
  //     .then((response: AxiosResponse) => {
  //       console.log(response.data);
  //       setFetchedUsers(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // const [fetchedUsers, setFetchedUsers] = useState<Array<UserInterface>>([]);
  const [indexRowToEdit, setIndexRowToEdit] = useState<number | null>(null);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([""]));

  const handleEditRow = (userId: string) => {
    setSelectedKeys(new Set([""]));

    console.log(users);
    const indexRow = users.findIndex((user) => user._id == userId);
    // console.log("indexRowToEdit: ", indexRowToEdit);
    // console.log("indexRow: ", indexRow);
    setIndexRowToEdit(1), () => console.log("THIS RUNS");
  };

  const renderCell = React.useCallback(
    (user: UserInterface, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserInterface];

      switch (columnKey) {
        case "username":
          return (
            <>
              {indexRowToEdit === null ? (
                <div>Index row to edit: {indexRowToEdit}</div>
              ) : (
                <TextInput />
              )}
            </>
          );
        case "actions":
          return (
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
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <>
      <Table
        color="default"
        selectionMode="multiple"
        aria-label="Example static collection table"
        isHeaderSticky
        removeWrapper
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        topContent={
          <>
            <div>INDEX ROW TO EDIT: {indexRowToEdit}</div>
            <div>SELECTED KEYS: {selectedKeys}</div>
          </>
        }
        classNames={{
          // base: "overflow-scroll",
          base: "max-h-[40vh] overflow-scroll",
          // table: "min-h-[420px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={users} className="test">
          {(user: UserInterface) => (
            <TableRow key={user._id}>
              {(columnKey) => (
                <TableCell>{renderCell(user, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
