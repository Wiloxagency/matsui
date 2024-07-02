import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

interface MissingPigmentsModalProps {
  isOpenMissingPigmentsModal: boolean;
  onOpenChangeMissingPigmentsModal: (value: boolean) => void;
  missingPigments: string[];
}

export default function MissingPigmentsModal({
  isOpenMissingPigmentsModal,
  onOpenChangeMissingPigmentsModal,
  missingPigments,
}: MissingPigmentsModalProps) {
  return (
    <Modal
      isOpen={isOpenMissingPigmentsModal}
      onOpenChange={onOpenChangeMissingPigmentsModal}
      placement="top-center"
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose: () => void) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              Missing pigments
            </ModalHeader>
            <ModalBody className="text-center">
              <>
                <p>
                  The series you are about to upload contains pigments that
                  don't exist in our database. You can still upload it but be
                  aware that formulas may not be displayed correctly until the
                  issue has been resolved. The missing pigments are:
                </p>
                <div className="my-4">
                  {missingPigments.map((missingPigment, indexPigment) => {
                    return (
                      <strong key={missingPigment}>
                        {missingPigment}
                        {indexPigment === missingPigments.length - 1
                          ? ""
                          : ", "}
                      </strong>
                    );
                  })}
                </div>
                <p>
                  Please contact your organization for instructions on how to
                  add these pigments to our database.
                </p>
              </>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                I understand
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
