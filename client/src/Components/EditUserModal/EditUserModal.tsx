import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { UserInterface } from "../../interfaces/interfaces";
import { useUpdateUserMutation } from "../../State/api";
import { useEffect, useState } from "react";
import { Flip, ToastContainer, toast } from "react-toastify";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  selectedUser: UserInterface | undefined;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<UserInterface | undefined>
  >;
  refetchUsers: () => void;
}
export default function EditUserModal({
  isOpen,
  onOpenChange,
  selectedUser,
  setSelectedUser,
  refetchUsers,
}: EditUserModalProps) {
  const [updateUser] = useUpdateUserMutation();
  const [userUsername, setUserUsername] = useState<string>("");
  const [userCompany, setUserCompany] = useState<string>("");

  const triggerUpdatedUserNotification = () => toast("😁 User updated!");

  async function handleSaveUser() {
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        username: userUsername,
        company: userCompany,
      };
      setSelectedUser(updatedUser);
      await updateUser(updatedUser)
        .unwrap()
        .then(async (response: any) => {
          if (response.modifiedCount === 1) {
            refetchUsers();
            triggerUpdatedUserNotification();
          }
          onOpenChange(false);
        });
    }
  }

  useEffect(() => {
    if (selectedUser) {
      setUserUsername(selectedUser.username);
      setUserCompany(selectedUser.company);
    }
  }, [selectedUser]);

  return (
    <>
      <ToastContainer transition={Flip} />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        //   isDismissable={false}
        //   isKeyboardDismissDisabled={true}
        //   hideCloseButton={true}
        scrollBehavior="outside"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit user
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Username"
                  type="text"
                  variant="bordered"
                  value={userUsername}
                  onChange={(event) => {
                    setUserUsername(event.target.value);
                  }}
                />
                <Input
                  label="Company"
                  type="text"
                  variant="bordered"
                  value={userCompany}
                  onChange={(event) => {
                    setUserCompany(event.target.value);
                  }}
                />
                <Input
                  label="Email"
                  type="text"
                  disabled
                  value={selectedUser?.email}
                />
                <Input
                  label="Registration date"
                  type="text"
                  disabled
                  value={String(selectedUser?.registrationDate)}
                />
                <Input
                  label="Last access"
                  type="text"
                  disabled
                  value={String(selectedUser?.lastAccess)}
                />
                <Input
                  label="Created formulas"
                  type="number"
                  disabled
                  value={String(selectedUser?.createdFormulas)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSaveUser}>
                  Save changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
