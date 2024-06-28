import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

interface ResetUserPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function ResetUserPasswordModal({
  isOpen,
  onOpenChange,
}: ResetUserPasswordModalProps) {
  return (
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
        {(onClose) => (
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
              <Button color="default" variant="light" onPress={onClose}>
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
  );
}
