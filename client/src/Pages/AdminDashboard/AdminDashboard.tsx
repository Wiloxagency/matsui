import "./AdminDashboard.scss";
import * as XLSX from "xlsx";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { FaEnvelope, FaFileExport } from "react-icons/fa";
import { Spinner } from "@nextui-org/spinner";
import { useMediaQuery } from "react-responsive";
import { api, useDeleteUserMutation, useGetUsersQuery } from "../../State/api";
import { FormulaInterface, UserInterface } from "../../interfaces/interfaces";
import SendEmailCard from "../../Components/SendEmailCard/SendEmailCard";
import DeleteUserModal from "../../Components/Modals/DeleteUserModal/DeleteUserModal";
import EditUserModal from "../../Components/Modals/EditUserModal/EditUserModal";
import ResetUserPasswordModal from "../../Components/Modals/ResetUserPasswordModal/ResetUserPasswordModal";
import Swatches from "../../Components/Swatches/Swatches";
import UsersTable from "../../Components/UsersTable/UsersTable";
// import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";

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
  const {
    isOpen: isOpenDeleteUserModal,
    onOpenChange: onOpenChangeDeleteUserModal,
  } = useDisclosure();
  // MODAL VARIABLES ☝🏻
  const { data: fetchedUsers, refetch: refetchUsers } = useGetUsersQuery();
  const [isSendEmailActive, setIsSendEmailActive] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = useState(new Set(""));
  const [indexRowToEdit, setIndexRowToEdit] = useState<number | null>(null);
  const [idUserToEdit, setIdUserToEdit] = useState<string | undefined>(
    undefined
  );
  idUserToEdit;
  const [indexesSelectedUsers, setIndexesSelectedUsers] = useState<number[]>(
    []
  );

  const [selectedUsers, setSelectedUsers] = useState<
    UserInterface[] | undefined
  >(undefined);

  const [selectedUser, setSelectedUser] = useState<UserInterface | undefined>(
    undefined
  );

  const [deleteUser] = useDeleteUserMutation();

  const [selectedFormula, setSelectedFormula] = useState<
    FormulaInterface | undefined
  >();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [
    triggerGetUserFormulas,
    { data: fetchedUserFormulas, isFetching: isGetUserFormulasFetching },
  ] = api.endpoints.getFormulas.useLazyQuery();

  const [isUserFormulasVisible, setIsUserFormulasVisible] =
    useState<boolean>(false);

  function handleSendEmail() {
    setIsSendEmailActive((previousValue) => !previousValue);
  }

  function setSelectedUserById(receivedUserId: string) {
    const getSelectedUser = fetchedUsers!.filter(
      (user) => user._id === receivedUserId
    )[0];
    setSelectedUser(getSelectedUser);
  }

  function handleEditUser(receivedUserId: string) {
    setIdUserToEdit(receivedUserId);
    setIndexRowToEdit(-1);
    onOpenEditUserModal();

    setSelectedUserById(receivedUserId);

    // const getSelectedUser = fetchedUsers!.filter(
    //   (user) => user._id === receivedUserId
    // )[0];
    // setSelectedUser(getSelectedUser);
  }

  function handleResetUserPassword(receivedUserId: string) {
    setSelectedUserById(receivedUserId);
    onOpenChangeResetUserPasswordModal();
  }

  function handleDeleteUser(receivedUserId: string) {
    setSelectedUserById(receivedUserId);
    onOpenChangeDeleteUserModal();
  }

  // function handleCloseModal() {
  //   setIndexRowToEdit(null);
  //   onOpenChangeEditUserModal();
  // }

  function handleExportUsers() {
    if (fetchedUsers) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const noIdUsers = fetchedUsers.map(({ _id, ...keepAttrs }) => {
        return keepAttrs;
      });
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(noIdUsers);
      XLSX.utils.book_append_sheet(workbook, worksheet, "All users");
      XLSX.writeFileXLSX(workbook, "matsui_all_users.xlsx");
    }
  }

  function handleCheckboxCheck(receivedUserIndex: number) {
    // IF ALL USERS HAVE BEEN DESELECTED 👇🏻
    if (
      indexesSelectedUsers.length === 1 &&
      indexesSelectedUsers[0] === receivedUserIndex
    ) {
      setIsUserFormulasVisible(false);
    }
    // IF THERE IS MORE THAN 1 USER SELECTED 👇🏻
    if (
      indexesSelectedUsers.length > 0 &&
      indexesSelectedUsers.indexOf(receivedUserIndex) === -1
    ) {
      setIsUserFormulasVisible(false);
    }

    if (indexesSelectedUsers.indexOf(receivedUserIndex) !== -1) {
      const filteredArray = indexesSelectedUsers.filter(
        (indexSelectedUser) => indexSelectedUser !== receivedUserIndex
      );
      if (filteredArray.length === 1) {
        const lastUserSelected = fetchedUsers![filteredArray[0]];
        triggerGetUserFormulas({ userEmail: lastUserSelected.email })
          .unwrap()
          .then(() => {
            setIsUserFormulasVisible(true);
          });
      }
      setIndexesSelectedUsers(filteredArray);
    } else {
      const pushReceivedIndex: number[] = [
        ...indexesSelectedUsers,
        receivedUserIndex,
      ];
      if (indexesSelectedUsers.length === 0) {
        const selectedUser = fetchedUsers![receivedUserIndex];
        triggerGetUserFormulas({ userEmail: selectedUser.email })
          .unwrap()
          .then(() => {
            setIsUserFormulasVisible(true);
          });
      }
      setIndexesSelectedUsers(pushReceivedIndex);
    }
  }

  function updateEmailRecipients() {
    if (fetchedUsers) {
      const filteredUsers = fetchedUsers.filter((_, indexUser) =>
        indexesSelectedUsers.includes(indexUser)
      );
      setSelectedUsers(filteredUsers);
    }
  }

  async function handleDeleteUserConfirmation(): Promise<void> {
    const deleteSeriesResponse = await deleteUser({
      userEmail: localStorage.getItem("userEmail")!,
    })
      .unwrap()
      .then(() => {
        refetchUsers();
        onOpenChangeDeleteUserModal();
      })
      .catch((error) => console.error("rejected", error));
    deleteSeriesResponse;
  }

  useEffect(() => {
    if (indexesSelectedUsers !== undefined) updateEmailRecipients();
  }, [indexesSelectedUsers]);

  return (
    <>
      <ResetUserPasswordModal
        isOpen={isOpenResetUserPasswordModal}
        onOpenChange={onOpenChangeResetUserPasswordModal}
        userEmail={selectedUser ? selectedUser.email : ""}
      ></ResetUserPasswordModal>
      <DeleteUserModal
        isOpen={isOpenDeleteUserModal}
        onOpenChange={onOpenChangeDeleteUserModal}
        handleDeleteUserConfirmation={handleDeleteUserConfirmation}
        userEmail={selectedUser ? selectedUser.email : ""}
      ></DeleteUserModal>
      <EditUserModal
        isOpen={isOpenEditUserModal}
        onOpenChange={onOpenChangeEditUserModal}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        refetchUsers={refetchUsers}
        fetchedUsers={fetchedUsers!}
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
                isDisabled={indexesSelectedUsers.length === 0}
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
                handleCheckboxCheck={handleCheckboxCheck}
                refetchUsers={refetchUsers}
                handleDeleteUser={handleDeleteUser}
              />
            ) : (
              <Spinner className="m-auto"></Spinner>
            )}
          </div>
        </div>
        <div
          className={isSendEmailActive ? "" : "bottomSectionContainer"}
          style={
            isSendEmailActive
              ? { flexDirection: "column" }
              : { flexDirection: "row" }
          }
        >
          {isSendEmailActive ? (
            <>
              <div className="sectionHeader">SEND EMAIL</div>
              <SendEmailCard
                setIsSendEmailActive={setIsSendEmailActive}
                selectedUsers={selectedUsers}
              />
            </>
          ) : (
            <>
              <span className="bottomHalf">
                <div className="sectionHeader">USER FORMULAS</div>
                <div className="card">
                  {isUserFormulasVisible && fetchedUserFormulas ? (
                    fetchedUserFormulas.length > 0 ? (
                      <div className="swatchesComponentContainer">
                        <Swatches
                          formulas={fetchedUserFormulas}
                          setSelectedFormula={setSelectedFormula}
                          selectedFormula={selectedFormula}
                          selectedSeries=""
                          triggerGetSimilarFormulas={() => {}}
                        />
                      </div>
                    ) : (
                      <span className="m-auto text-center">
                        This user hasn't created any formulas yet
                      </span>
                    )
                  ) : (
                    !isGetUserFormulasFetching && (
                      <span className="m-auto text-center">
                        Click on a user to see their formulas
                        <br />
                        (under construction)
                      </span>
                    )
                  )}
                  {isGetUserFormulasFetching && (
                    <Spinner className="m-auto"></Spinner>
                  )}
                </div>
              </span>
              <span className="bottomHalf">
                <div className="sectionHeader">
                  FORMULA DETAILS: DC NEO 285 C
                </div>
                <div className="card">
                  {/* {selectedFormula && (
                    <FormulaDetailsTable formula={selectedFormula}  />
                  )} */}
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
