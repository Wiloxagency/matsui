import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

interface ImportedSeriesModalProps {
  isOpenImportedSeriesModal: boolean;
  onOpenChangeImportedSeriesModal: (value: boolean) => void;
  numberOfImportedComponents: number;
  newSeriesName: string;
}

export default function ImportedSeriesModal({
  isOpenImportedSeriesModal,
  onOpenChangeImportedSeriesModal,
  numberOfImportedComponents,
  newSeriesName,
}: ImportedSeriesModalProps) {
  return (
    <Modal
      isOpen={isOpenImportedSeriesModal}
      onOpenChange={onOpenChangeImportedSeriesModal}
      placement="top-center"
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose: () => void) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              Imported series
            </ModalHeader>
            <ModalBody className="text-center">
              <p>
                Series <strong>{newSeriesName}</strong> was created
                successfully.
              </p>
              <p>{numberOfImportedComponents} components were imported</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
