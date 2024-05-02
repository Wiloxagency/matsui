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
  const [fetchedUsers, setFetchedUsers] = useState<Array<UserInterface>>([]);

  useEffect(() => {
    (async () => {
      setFetchedUsers(await getUsers());
    })();

    return () => {
      // Component unmount code.
    };
  }, []);

  const [isSendEmailActive, setIsSendEmailActive] = useState(false);
  // MODAL VARIABLES 👇🏻
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleClick() {
    setIsSendEmailActive((previousValue) => !previousValue);
    // console.log(isSendEmailActive);
  }

  return (
    <>
      <div className="topSectionContainer">
        <div className="sectionHeader">
          <span style={{ marginRight: "auto" }}>USER</span>{" "}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Reset password
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      You're about to send this user an email with instructions
                      to reset their password.
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
              )}
            </ModalContent>
          </Modal>
          <ReusableButton
            style={{ marginRight: "2rem" }}
            className="underlineButton"
            buttonText="SEND EMAIL"
            Icon={FaEnvelope}
            onClick={handleClick}
          />
          <ReusableButton
            className="underlineButton"
            buttonText="RESET PASSWORD"
            Icon={FaLock}
            onClick={onOpen}
          />
        </div>
        <div className="card">
          <UsersTable users={fetchedUsers} />
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
            <SendEmailCard />
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
