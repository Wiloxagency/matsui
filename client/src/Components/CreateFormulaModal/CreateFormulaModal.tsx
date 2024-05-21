import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import {
  FormulaComponentInterface,
  PigmentInterface,
} from "../../interfaces/interfaces";
import "./CreateFormulaModal.scss";
// import { FaEnvelope, FaLock } from "react-icons/fa";
import { ChromePicker, ColorResult } from "react-color";
import { FaTrash } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

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

  const [isColorPickerVisible, setIsColorPickerVisible] =
    useState<boolean>(false);

  const [formulaColor, setFormulaColor] = useState<string>("#2dacb8");

  const [newFormulaComponents, setNewFormulaComponents] = useState<
    FormulaComponentInterface[]
  >([
    {
      FormulaSerie: "",
      FormulaCode: "",
      FormulaDescription: "",
      ComponentCode: "",
      ComponentDescription: "",
      Percentage: 0,
    },
  ]);

  const handleColorPickerChange = (color: ColorResult) => {
    setFormulaColor(color.hex);
  };

  const handleSelectNewFormulaSeries = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedNewFormulaSeries(e.target.value);
  };

  function handleAddFormulaComponent() {
    setNewFormulaComponents((newFormulaComponents) => [
      ...newFormulaComponents,
      {
        FormulaSerie: "",
        FormulaCode: "",
        FormulaDescription: "",
        ComponentCode: "",
        ComponentDescription: "",
        Percentage: 0,
      },
    ]);
  }

  function handleDeleteFormulaComponent(
    receivedComponent: FormulaComponentInterface
  ) {
    // const splicedArray = newFormulaComponents.splice(receivedIndexFormula, 1);
    const filteredArray = newFormulaComponents.filter(
      (formula) => formula.ComponentCode !== receivedComponent.ComponentCode
    );
    setNewFormulaComponents(filteredArray);
  }

  return (
    <>
      <Modal
        isOpen={isOpenCreateFormulaModal}
        onOpenChange={onOpenChangeCreateFormulaModal}
        placement="top-center"
        backdrop="blur"
        scrollBehavior="outside"
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
                  isRequired={true}
                />
                <Input
                  //   endContent={
                  //     <FaLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  //   }
                  label="Formula description"
                  placeholder="Ex: 301 OW NEO 100 C"
                  variant="bordered"
                  isRequired={true}
                />

                <div style={{ display: "flex" }}>
                  <span
                    className="formulaColorPreview"
                    style={{ background: `${formulaColor} content-box` }}
                    onClick={() =>
                      setIsColorPickerVisible(!isColorPickerVisible)
                    }
                  ></span>

                  <Button
                    color="primary"
                    variant="light"
                    onPress={() =>
                      setIsColorPickerVisible(!isColorPickerVisible)
                    }
                  >
                    Choose formula color
                  </Button>
                </div>
                {isColorPickerVisible ? (
                  <div className={"colorPickerPopover"}>
                    <div
                      className={"colorPickerCover"}
                      onClick={() => setIsColorPickerVisible(false)}
                    />
                    <ChromePicker
                      color={formulaColor}
                      disableAlpha={true}
                      onChange={handleColorPickerChange}
                    />
                    <span className="closeColorPickerButton">
                      <Button
                        isIconOnly={true}
                        color="danger"
                        size="sm"
                        onPress={() => setIsColorPickerVisible(false)}
                      >
                        <FaX></FaX>
                      </Button>
                    </span>
                  </div>
                ) : null}

                <p className="mx-auto">Components</p>
                <Divider className="my-1" />

                {newFormulaComponents.map((formulaComponent, indexFormula) => {
                  return (
                    <div key={indexFormula} style={{ display: "flex" }}>
                      <Button
                        className="my-auto mr-1"
                        variant="light"
                        color="danger"
                        isIconOnly={true}
                        isDisabled={indexFormula === 0}
                        onPress={() =>
                          handleDeleteFormulaComponent(formulaComponent)
                        }
                      >
                        <FaTrash></FaTrash>
                      </Button>
                      <span style={{ flex: "3", marginRight: "1rem" }}>
                        <Select
                          label="Select pigment"
                          variant="bordered"
                          radius="full"
                          //   placeholder="301"
                          isRequired={true}
                          required
                          value={formulaComponent.ComponentCode}
                          //   onChange={(e) => handleSelectNewFormulaSeries(e)}
                        >
                          {fetchedPigments !== undefined ? (
                            fetchedPigments.map((pigment) => (
                              <SelectItem
                                key={pigment.code}
                                value={pigment.code}
                              >
                                {pigment.code}
                              </SelectItem>
                            ))
                          ) : (
                            <Spinner className="m-auto" />
                          )}
                        </Select>
                      </span>
                      <span style={{ flex: "1" }}>
                        <Input
                          label="Percentage"
                          placeholder="0.00"
                          labelPlacement="inside"
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                %
                              </span>
                            </div>
                          }
                          type="number"
                        />
                      </span>
                    </div>
                  );
                })}

                <Button
                  variant="light"
                  color="primary"
                  onPress={handleAddFormulaComponent}
                >
                  + Add component
                </Button>

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
