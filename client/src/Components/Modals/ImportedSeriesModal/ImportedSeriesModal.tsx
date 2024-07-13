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
  numberOfImportedFormulas: number;
  nullFormulaCodes: string[];
  newSeriesName: string;
}

export default function ImportedSeriesModal({
  isOpenImportedSeriesModal,
  onOpenChangeImportedSeriesModal,
  numberOfImportedFormulas,
  newSeriesName,
  nullFormulaCodes,
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
              <p>{numberOfImportedFormulas} formulas were imported</p>
              {nullFormulaCodes.length > 0 && (
                <>
                  <p>
                    The following formulas couldn't be created as their codes
                    did not match any known formulas:
                  </p>
                  <p>
                    <strong>{nullFormulaCodes}</strong>
                  </p>
                </>
              )}
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
