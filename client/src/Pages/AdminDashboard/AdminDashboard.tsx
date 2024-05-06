import { useEffect, useState } from "react";
import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import Swatches from "../../Components/Swatches/Swatches";
import UsersTable from "../../Components/UsersTable/UsersTable";
import "./AdminDashboard.scss";
import SendEmailCard from "../../Components/SendEmailCard/SendEmailCard";
import ReusableButton from "../../Components/ReusableButton/ReusableButton";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Button } from "@nextui-org/button";
import { UserInterface } from "../../interfaces/interfaces";
import axios, { AxiosResponse } from "axios";
import { Input } from "@nextui-org/input";

const API_URL = import.meta.env.VITE_API_URL;

async function getUsers(): Promise<UserInterface[]> {
  const users = await axios
    .get(API_URL + "users", {
      headers: { "Content-type": "application/json" },
    })
    .then((response: AxiosResponse) => {
      // console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  // console.log(users);

  return users;
}

export default function AdminDashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // MODAL VARIABLES ☝🏻
  const [fetchedUsers, setFetchedUsers] = useState<Array<UserInterface>>([]);
  const [isSendEmailActive, setIsSendEmailActive] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = useState(new Set(""));
  const [indexRowToEdit, setIndexRowToEdit] = useState<number | null>(null);
  const [idUserToEdit, setIdUserToEdit] = useState<string | undefined>(
    undefined
  );

  function handleClick() {
    setIsSendEmailActive((previousValue) => !previousValue);
    // console.log(isSendEmailActive);
  }

  function handleEditRow(userId: string) {
    // console.log(userId);
    setIdUserToEdit(userId);
    setIndexRowToEdit(-1);
    // console.log(fetchedUsers);
    onOpen();
  }

  function handleCloseModal() {
    console.log("test");
    setIndexRowToEdit(null);
    onOpenChange();
  }

  useEffect(() => {
    (async () => {
      setFetchedUsers(await getUsers());
    })();

    return () => {
      // Component unmount code.
    };
  }, []);

  useEffect(() => {
    setSelectedRowsIds(new Set(""));
    const indexRow = fetchedUsers.findIndex((user) => user._id == idUserToEdit);
    console.log(indexRow);
    if (indexRow !== -1) {
      setIndexRowToEdit(indexRow);
    }
  }, [indexRowToEdit]);

  // useEffect(() => {
  //   setIndexRowToEdit(null);
  // }, [selectedRowsIds]);
  //
  // useEffect(() => {
  //   if (!isOpen) {
  //     console.log("CLOSED MODAL");
  //     // setIndexRowToEdit(null)
  //   }
  // }, [onOpenChange]);

  return (
    <>
      <div className="topSectionContainer">
        <div className="sectionHeader">
          <span style={{ marginRight: "auto" }}>USER</span>{" "}
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            hideCloseButton={true}
          >
            <ModalContent>
              {(onClose) =>
                indexRowToEdit === null || indexRowToEdit === -1 ? (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Reset password
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        You're about to send this user an email with
                        instructions to reset their password.
                      </p>
                      <p>Do you wish to proceed?</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Send reset password email
                      </Button>
                    </ModalFooter>
                  </>
                ) : (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Edit user
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        label="Username"
                        type="text"
                        variant="bordered"
                        autoFocus
                      />
                      <Input label="Company" type="text" variant="bordered" />
                      <Input label="Email" type="text" disabled />
                      <Input label="Registration date" type="text" disabled />
                      <Input label="Last access" type="text" disabled />
                      <Input label="Created formulas" type="number" disabled />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={handleCloseModal}
                      >
                        Close
                      </Button>
                      <Button color="primary" onPress={handleCloseModal}>
                        Save changes
                      </Button>
                    </ModalFooter>
                  </>
                )
              }
            </ModalContent>
          </Modal>
          {isSendEmailActive || selectedRowsIds.size == 0 ? null : (
            <>
              <span style={{ marginRight: "2rem" }}>
                <ReusableButton
                  className="underlineButton"
                  buttonText="SEND EMAIL"
                  Icon={FaEnvelope}
                  handleClick={handleClick}
                />
              </span>
              <ReusableButton
                className="underlineButton"
                buttonText="RESET PASSWORD"
                Icon={FaLock}
                handleClick={onOpen}
              />
            </>
          )}
        </div>
        <div className="card">
          <UsersTable
            users={fetchedUsers}
            selectedRowsIds={selectedRowsIds}
            setSelectedRowsIds={setSelectedRowsIds}
            indexRowToEdit={indexRowToEdit}
            // setIndexRowToEdit={setIndexRowToEdit}
            handleEditRow={handleEditRow}
          />
        </div>
      </div>
      <div
        className="bottomSectionContainer"
        style={
          isSendEmailActive
            ? { flexDirection: "column" }
            : { flexDirection: "row" }
        }
      >
        {isSendEmailActive ? (
          <>
            <div className="sectionHeader">SEND EMAIL</div>
            <SendEmailCard setIsSendEmailActive={setIsSendEmailActive} />
          </>
        ) : (
          <>
            <span className="bottomHalf">
              <div className="sectionHeader">USER FORMULAS</div>
              <div className="card">
                <div className="swatchesComponentContainer">
                  <Swatches />
                </div>
              </div>
            </span>
            <span className="bottomHalf">
              <div className="sectionHeader">FORMULA DETAILS: DC NEO 285 C</div>
              <div className="card">
                <FormulaDetailsTable />
              </div>
            </span>
          </>
        )}
      </div>
    </>
  );
}
