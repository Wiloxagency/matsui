import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}
export default function EditUserModal({
  isOpen,
  onOpenChange,
}: EditUserModalProps) {
  return (
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
            <ModalHeader className="flex flex-col gap-1">Edit user</ModalHeader>
            <ModalBody>
              <Input label="Username" type="text" variant="bordered" />
              <Input label="Company" type="text" variant="bordered" />
              <Input label="Email" type="text" disabled />
              <Input label="Registration date" type="text" disabled />
              <Input label="Last access" type="text" disabled />
              <Input label="Created formulas" type="number" disabled />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Save changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
