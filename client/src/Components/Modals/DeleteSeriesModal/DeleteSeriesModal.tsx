import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { useEffect, useState } from "react";

interface DeleteSeriesModalProps {
  isOpenDeleteSeriesModal: boolean;
  onOpenChangeDeleteSeriesModal: (value: boolean) => void;
  seriesToDelete: string;
  handleDeleteSeries: () => void;
  wasSeriesDeleted: boolean | undefined;
  numberOfDeletedComponents: number | null;
  handleCloseDeleteSeriesModal: () => void;
}

export default function DeleteSeriesModal({
  isOpenDeleteSeriesModal,
  onOpenChangeDeleteSeriesModal,
  seriesToDelete,
  handleDeleteSeries,
  wasSeriesDeleted,
  numberOfDeletedComponents,
  handleCloseDeleteSeriesModal,
}: DeleteSeriesModalProps) {
  const [isSpinnerVisible, setIsSpinnerVisible] = useState<boolean>(false);

  function handleDeletionConfirmation() {
    setIsSpinnerVisible(true);
    handleDeleteSeries();
  }

  useEffect(() => {
    if (seriesToDelete === "") {
      setIsSpinnerVisible(false);
    }
  }, [seriesToDelete]);
  return (
    <Modal
      isOpen={isOpenDeleteSeriesModal}
      onOpenChange={onOpenChangeDeleteSeriesModal}
      placement="top-center"
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose: () => void) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              Delete series
            </ModalHeader>
            <ModalBody className="text-center">
              {wasSeriesDeleted === undefined ? (
                <>
                  <p>⚠️ THIS ACTION CAN'T BE UNDONE ⚠️</p>
                  <p>
                    By deleting a series you will also be deleting{" "}
                    <strong>ALL FORMULAS</strong> associated with it.
                  </p>
                  <p>
                    Are you sure you wish to proceed with the deletion of the
                    series <strong>{seriesToDelete}</strong>?
                  </p>
                </>
              ) : (
                <>
                  <p>Deletion results</p>
                  <p>
                    {wasSeriesDeleted
                      ? `Series ${seriesToDelete} deleted succesfully`
                      : `Series ${seriesToDelete} was NOT deleted. Check that you entered the right name.`}
                  </p>
                  <p>
                    Associated components deleted: {numberOfDeletedComponents}
                  </p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {/* TODO: DELETE THIS LINE AND FIX THE RESULTING ERROR 👇🏻 */}
              {<span onClick={onClose} style={{ display: "none" }}></span>}
              <Button
                color="default"
                variant="light"
                onPress={handleCloseDeleteSeriesModal}
              >
                Close
              </Button>
              {wasSeriesDeleted === undefined ? (
                <Button
                  color="danger"
                  onPress={handleDeletionConfirmation}
                  isLoading={
                    isSpinnerVisible && numberOfDeletedComponents === null
                  }
                >
                  CONFIRM DELETION
                </Button>
              ) : (
                <></>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
