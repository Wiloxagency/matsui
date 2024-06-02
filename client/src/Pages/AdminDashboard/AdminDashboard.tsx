import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { FaEnvelope, FaFileExport, FaLock } from "react-icons/fa";
// import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import ReusableButton from "../../Components/ReusableButton/ReusableButton";
import SendEmailCard from "../../Components/SendEmailCard/SendEmailCard";
// import Swatches from "../../Components/Swatches/Swatches";
import UsersTable from "../../Components/UsersTable/UsersTable";
import "./AdminDashboard.scss";
import { Input } from "@nextui-org/input";
import { useGetUsersQuery } from "../../State/api";
import { useMediaQuery } from "react-responsive";
import { Spinner } from "@nextui-org/spinner";

export default function AdminDashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // MODAL VARIABLES ☝🏻
  const { data: fetchedUsers } = useGetUsersQuery();
  const [isSendEmailActive, setIsSendEmailActive] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = useState(new Set(""));
  const [indexRowToEdit, setIndexRowToEdit] = useState<number | null>(null);
  const [idUserToEdit, setIdUserToEdit] = useState<string | undefined>(
    undefined
  );

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

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

  function handleExportUsers() {}

  useEffect(() => {
    setSelectedRowsIds(new Set(""));
    if (fetchedUsers === undefined) return;
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
        scrollBehavior="outside"
        placement="top-center"
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
                    You're about to send this user an email with instructions to
                    reset their password.
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
                  <Input label="Username" type="text" variant="bordered" />
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
      <div
        className={
          isMobile
            ? "adminDashboardLayout mobileLayout"
            : "adminDashboardLayout"
        }
      >
        <div className="topSectionContainer">
          <div className="sectionHeader">
            <span>USERS</span>{" "}
            <Button
              className="mr-auto"
              startContent={<FaFileExport />}
              variant="bordered"
              onClick={handleExportUsers}
            >
              EXPORT USERS
            </Button>
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
          <div
            className="card"
            style={{ width: "100%", minWidth: "350px", maxWidth: "100vw" }}
          >
            {fetchedUsers !== undefined ? (
              <UsersTable
                users={fetchedUsers}
                selectedRowsIds={selectedRowsIds}
                setSelectedRowsIds={setSelectedRowsIds}
                indexRowToEdit={indexRowToEdit}
                // setIndexRowToEdit={setIndexRowToEdit}
                handleEditRow={handleEditRow}
              />
            ) : (
              <Spinner className="m-auto"></Spinner>
            )}
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
                  <span className="m-auto text-center">
                    Click on a user to see their formulas
                    <br />
                    (under construction)
                  </span>
                  {/* <div className="swatchesComponentContainer"> */}
                  {/* <Swatches formulas={[]} selectedFormula={selectedFormula} /> */}
                  {/* </div> */}
                </div>
              </span>
              <span className="bottomHalf">
                <div className="sectionHeader">
                  FORMULA DETAILS: DC NEO 285 C
                </div>
                <div className="card">
                  {/* <FormulaDetailsTable /> */}
                  <span className="m-auto text-center">
                    Click on a formula to see its details
                    <br />
                    (under construction)
                  </span>
                </div>
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}
