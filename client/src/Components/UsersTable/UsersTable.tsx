import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Dispatch, SetStateAction } from "react";
import { FaEllipsisV, FaTrash } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "../../../node_modules/react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { UserInterface } from "../../interfaces/interfaces";
import "./UsersTable.scss";
import { returnFormattedDate } from "../../Utilities/returnFormattedDate";
import { useDeleteUserMutation } from "../../State/api";

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
  handleEditUser: (userId: string) => void;
  handleResetUserPassword: () => void;
  handleCheckboxCheck: (value: number) => void;
  refetchUsers: () => void;
  // setIndexRowToEdit: Dispatch<SetStateAction<number | null>>;
}

export default function UsersTable({
  users,
  // selectedRowsIds,
  // setSelectedRowsIds,
  // indexRowToEdit,

  // setIndexRowToEdit,
  handleEditUser,
  handleResetUserPassword,
  handleCheckboxCheck,
  refetchUsers,
}: UsersTableProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [deleteUser] = useDeleteUserMutation();

  async function handleDeleteUser(): Promise<void> {
    const deleteSeriesResponse = await deleteUser({
      userEmail: "ADD EMAIL HERE",
    })
      .unwrap()
      .then((payload: any) => {
        console.log("fulfilled", payload);
        refetchUsers();
      })
      .catch((error) => console.error("rejected", error));
    deleteSeriesResponse;
  }

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
          {users.map((user, indexUser) => {
            return (
              <Tr key={user._id}>
                <Td>
                  <Checkbox
                    onClick={() => handleCheckboxCheck(indexUser)}
                  ></Checkbox>
                </Td>
                <Td>
                  <span className={user.username === "" ? "unsetValue" : ""}>
                    {user.username !== "" ? user.username : "unset"}
                  </span>
                </Td>

                <Td>{user.email}</Td>
                <Td>
                  <span className={user.company === "" ? "unsetValue" : ""}>
                    {user.company !== "" ? user.company : "unset"}
                  </span>
                </Td>
                <Td>{user.status}</Td>
                <Td>{returnFormattedDate(user.registrationDate)}</Td>
                <Td>{user.createdFormulas}</Td>
                <Td>{returnFormattedDate(user.lastAccess)}</Td>
                <Td>
                  {isMobile ? (
                    <Button
                      color="primary"
                      onPress={() => handleEditUser(user._id)}
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
                        <DropdownItem onClick={() => handleEditUser(user._id)}>
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          className="text-danger"
                          variant="faded"
                          color="danger"
                          onClick={() => handleResetUserPassword()}
                        >
                          Reset user password
                        </DropdownItem>
                        <DropdownItem
                          startContent={<FaTrash></FaTrash>}
                          className="text-danger"
                          variant="solid"
                          color="danger"
                          onClick={() => handleDeleteUser()}
                        >
                          DELETE USER
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
