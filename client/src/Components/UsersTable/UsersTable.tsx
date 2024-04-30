import { FaEllipsisV, FaPen } from "react-icons/fa";
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
export default function UsersTable() {
  useEffect(() => {
    axios
      .get(API_URL + "users", {
        headers: { "Content-type": "application/json" },
      })
      .then((response: AxiosResponse) => {
        console.log(response.data);
        setFetchedUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [fetchedUsers, setFetchedUsers] = useState<Array<UserInterface>>([]);
  const [indexRowToEdit, setIndexRowToEdit] = useState<number | null>(null);

  const handleEditRow = (userId: string) => {
    const indexRow = fetchedUsers.findIndex((user) => user._id == userId);
    console.log("indexRowToEdit: ", indexRowToEdit, "indexRow: ", indexRow);
    setIndexRowToEdit(indexRow), () => console.log("THIS RUNS");
  };

  const renderCell = React.useCallback(
    (user: UserInterface, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserInterface];

      switch (columnKey) {
        case "username":
          return <span>{indexRowToEdit}</span>;
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
        defaultSelectedKeys={["1"]}
        aria-label="Example static collection table"
        removeWrapper
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={fetchedUsers}>
          {(user: UserInterface) => (
            <TableRow key={user._id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "actions" ? (
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
                  ) : (
                    renderCell(user, columnKey)
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
