import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  //   useDisclosure,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import { PigmentInterface } from "../../interfaces/interfaces";
// import { FaEnvelope, FaLock } from "react-icons/fa";

interface CreateFormulaModalProps {
  isOpenCreateFormulaModal: boolean;
  onOpenChangeCreateFormulaModal: () => void;
  fetchedSeries: { seriesName: string }[] | undefined;
  fetchedPigments: PigmentInterface[] | undefined;
}

export default function CreateFormulaModal({
  isOpenCreateFormulaModal,
  onOpenChangeCreateFormulaModal,
  fetchedSeries,
  fetchedPigments,
}: CreateFormulaModalProps) {
  const [selectedNewFormulaSeries, setSelectedNewFormulaSeries] =
    useState<string>("301");

  const handleSelectNewFormulaSeries = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedNewFormulaSeries(e.target.value);
  };

  return (
    <>
      <Modal
        isOpen={isOpenCreateFormulaModal}
        onOpenChange={onOpenChangeCreateFormulaModal}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new formula
              </ModalHeader>
              <ModalBody>
                <Select
                  label="Select series"
                  variant="bordered"
                  radius="full"
                  //   placeholder="301"
                  isRequired={true}
                  required
                  value={selectedNewFormulaSeries}
                  onChange={(e) => handleSelectNewFormulaSeries(e)}
                >
                  {fetchedSeries !== undefined ? (
                    fetchedSeries.map((series) => (
                      <SelectItem
                        key={series.seriesName}
                        value={series.seriesName}
                      >
                        {series.seriesName}
                      </SelectItem>
                    ))
                  ) : (
                    <Spinner className="m-auto" />
                  )}
                </Select>

                <Input
                  //   autoFocus
                  //   endContent={<FaEnvelope />}
                  label="Formula code"
                  placeholder="Ex: 100 C"
                  variant="bordered"
                />
                <Input
                  //   endContent={
                  //     <FaLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  //   }
                  label="Formula description"
                  placeholder="Ex: 301 OW NEO 100 C"
                  variant="bordered"
                />
                <Select
                  label="Select pigment"
                  variant="bordered"
                  radius="full"
                  //   placeholder="301"
                  isRequired={true}
                  required
                  //   value={selectedNewFormulaSeries}
                  //   onChange={(e) => handleSelectNewFormulaSeries(e)}
                >
                  {fetchedPigments !== undefined ? (
                    fetchedPigments.map((pigment) => (
                      <SelectItem key={pigment.code} value={pigment.code}>
                        {pigment.code}
                      </SelectItem>
                    ))
                  ) : (
                    <Spinner className="m-auto" />
                  )}
                </Select>
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Is formula active?
                  </Checkbox>
                  {/* <a color="primary" href="#">
                    Forgot password?
                  </a> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  //  type="submit"
                  onPress={onClose}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
