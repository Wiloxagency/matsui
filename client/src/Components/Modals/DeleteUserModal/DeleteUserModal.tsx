import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

interface DeleteUserModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  handleDeleteUserConfirmation: () => void;
}

export default function DeleteUserModal({
  isOpen,
  onOpenChange,
  handleDeleteUserConfirmation,
}: DeleteUserModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent className="text-center">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete user
            </ModalHeader>
            <ModalBody>
              <p>You're about to delete this user.</p>
              <p>This action cannot be undone.</p>
              <p>Are you sure you want to proceed?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="danger" onPress={handleDeleteUserConfirmation}>
                Delete user
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
