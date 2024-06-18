import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import { useState } from "react";
import { FaEnvelope, FaFileExport } from "react-icons/fa";
// import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import SendEmailCard from "../../Components/SendEmailCard/SendEmailCard";
// import Swatches from "../../Components/Swatches/Swatches";
import { Spinner } from "@nextui-org/spinner";
import { useMediaQuery } from "react-responsive";
import EditUserModal from "../../Components/EditUserModal/EditUserModal";
import ResetUserPasswordModal from "../../Components/ResetUserPasswordModal/ResetUserPasswordModal";
import UsersTable from "../../Components/UsersTable/UsersTable";
import { useGetUsersQuery } from "../../State/api";
import "./AdminDashboard.scss";

export default function AdminDashboard() {
  const {
    isOpen: isOpenEditUserModal,
    onOpen: onOpenEditUserModal,
    onOpenChange: onOpenChangeEditUserModal,
  } = useDisclosure();
  const {
    isOpen: isOpenResetUserPasswordModal,
    onOpenChange: onOpenChangeResetUserPasswordModal,
  } = useDisclosure();
  // MODAL VARIABLES ☝🏻
  const { data: fetchedUsers } = useGetUsersQuery();
  const [isSendEmailActive, setIsSendEmailActive] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = useState(new Set(""));
  const [indexRowToEdit, setIndexRowToEdit] = useState<number | null>(null);
  const [idUserToEdit, setIdUserToEdit] = useState<string | undefined>(
    undefined
  );

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  function handleSendEmail() {
    setIsSendEmailActive((previousValue) => !previousValue);
    // console.log(isSendEmailActive);
  }

  function handleEditUser(userId: string) {
    // console.log(userId);
    console.log(idUserToEdit);
    setIdUserToEdit(userId);
    setIndexRowToEdit(-1);
    // console.log(fetchedUsers);
    onOpenEditUserModal();
  }

  function handleResetUserPassword() {
    onOpenChangeResetUserPasswordModal();
  }

  // function handleCloseModal() {
  //   console.log("test");
  //   setIndexRowToEdit(null);
  //   onOpenChangeEditUserModal();
  // }

  function handleExportUsers() {}

  // useEffect(() => {
  //   setSelectedRowsIds(new Set(""));
  //   if (fetchedUsers === undefined) return;
  //   const indexRow = fetchedUsers.findIndex((user) => user._id == idUserToEdit);
  //   console.log(indexRow);
  //   if (indexRow !== -1) {
  //     setIndexRowToEdit(indexRow);
  //   }
  // }, [indexRowToEdit]);

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
      <ResetUserPasswordModal
        isOpen={isOpenResetUserPasswordModal}
        onOpenChange={onOpenChangeResetUserPasswordModal}
      ></ResetUserPasswordModal>
      <EditUserModal
        isOpen={isOpenEditUserModal}
        onOpenChange={onOpenChangeEditUserModal}
      ></EditUserModal>
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
            <span style={{ marginRight: "2rem" }}>
              <Button
                color="primary"
                className="underlineButton"
                startContent={<FaEnvelope />}
                onClick={handleSendEmail}
                isDisabled={true}
              >
                SEND EMAIL
              </Button>
            </span>
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
                handleEditUser={handleEditUser}
                handleResetUserPassword={handleResetUserPassword}
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
