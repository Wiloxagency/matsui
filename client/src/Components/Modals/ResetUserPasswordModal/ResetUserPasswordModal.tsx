import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { toast } from "react-toastify";
import { api } from "../../../State/api";

interface ResetUserPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  userEmail: string;
}

export default function ResetUserPasswordModal({
  isOpen,
  onOpenChange,
  userEmail,
}: ResetUserPasswordModalProps) {
  const [triggerSendEmail] = api.endpoints.sendEmail.useLazyQuery();
  const triggerSentEmailNotification = () => toast("📨 Email sent!");

  function handleResetUserPassword() {
    const sendEmailPayload = {
      recipients: [userEmail],
      subject: "",
      message: "",
      isResetPasswordEmail: true,
    };

    triggerSendEmail(sendEmailPayload)
      .unwrap()
      .then((payload: any) => {
        if (payload.message === "Message sent") {
          triggerSentEmailNotification();
          onOpenChange(false);
        }
      })
      .catch((error) => console.error("rejected", error));
  }

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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reset password
              </ModalHeader>
              <ModalBody>
                <p>
                  You're about to send {userEmail} an email with instructions to
                  reset their password.
                </p>
                <p>Do you wish to proceed?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleResetUserPassword}>
                  Send reset password email
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
