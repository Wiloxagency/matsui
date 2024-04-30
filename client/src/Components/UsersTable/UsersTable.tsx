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
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { UserInterface } from "../../interfaces/interfaces";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

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
  const [fetchedUsers, setFetchedUsers] = useState<Array<UserInterface>>([]);
  const [indexRowToEdit, setIndexRowToEdit] = useState<number | null>(null);

  const handleEditRow = (userId: string) => {
    const indexRow = fetchedUsers.findIndex((user) => user._id == userId);
    setIndexRowToEdit(indexRow);
  };

  useEffect(() => {
    console.log("test");
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
                        <span>
                          <FaEllipsisV />
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="dropdown">
                        <DropdownItem onClick={() => handleEditRow(user._id)}>
                          Edit
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    // <Tooltip content="Edit">
                    //   <span>
                    //     <FaPen className="icon" />
                    //   </span>
                    // </Tooltip>
                    getKeyValue(user, columnKey)
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
