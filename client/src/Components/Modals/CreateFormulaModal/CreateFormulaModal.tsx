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
import { Dispatch, useEffect, useState } from "react";
import {
  FormulaComponentInterface,
  FormulaInterface,
  PigmentInterface,
} from "../../../interfaces/interfaces";
import "./CreateFormulaModal.scss";
// import { FaEnvelope, FaLock } from "react-icons/fa";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { cn } from "@nextui-org/system";
import { Tooltip } from "@nextui-org/tooltip";
import { ChromePicker } from "react-color";
import { FaTrash } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddOrEditFormulaMutation } from "../../../State/api";
import { returnHexColor } from "../../../Utilities/returnHexColor";

interface CreateFormulaModalProps {
  isOpenCreateFormulaModal: boolean;
  onOpenChangeCreateFormulaModal: (value: boolean) => void;
  fetchedSeries: { seriesName: string }[] | undefined;
  fetchedPigments: PigmentInterface[] | undefined;
  refetchFormulas: () => void;
  isEditOrCreate: "edit" | "create";
  selectedFormula: FormulaInterface | undefined;
  setSelectedFormula: Dispatch<
    React.SetStateAction<FormulaInterface | undefined>
  >;
}

export default function CreateFormulaModal({
  isOpenCreateFormulaModal,
  onOpenChangeCreateFormulaModal,
  fetchedSeries,
  fetchedPigments,
  refetchFormulas,
  isEditOrCreate,
  selectedFormula,
  setSelectedFormula,
}: CreateFormulaModalProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [selectedNewFormulaSeries, setSelectedNewFormulaSeries] =
    useState<string>("");

  const [newFormulaCode, setNewFormulaCode] = useState<string>("");

  const [newFormulaDescription, setNewFormulaDescription] =
    useState<string>("");

  const [isColorPickerVisible, setIsColorPickerVisible] =
    useState<boolean>(false);

  const [newFormulaColor, setNewFormulaColor] = useState<string>("#fff");

  const [newFormulaComponents, setNewFormulaComponents] = useState<
    FormulaComponentInterface[]
  >([
    {
      FormulaSerie: "",
      FormulaCode: "",
      FormulaDescription: "",
      ComponentCode: "ALPHA BASE",
      ComponentDescription: "",
      Percentage: "",
    },
  ]);

  const [isNewFormulaActive, setIsNewFormulaActive] = useState<boolean>(true);

  const [validationMessage, setValidationMessage] = useState<string>("");

  const [newFormulaWeight, setNewFormulaWeight] = useState<number>(100);

  const [formulaUnit, setFormulaUnit] = useState<"Grams" | "Percentage">(
    "Percentage"
  );

  const [addOrEditFormula] = useAddOrEditFormulaMutation();

  const triggerAddedFormulaNotification = () => {
    isEditOrCreate === "create"
      ? toast("🎨 Formula added!")
      : toast("🎨 Formula edited!");
  };

  const handleSelectNewFormulaSeries = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedNewFormulaSeries(e.target.value);
  };

  function handleComponentPigmentSelectChange(
    receivedComponentCode: string,
    receivedIndexComponent: number
  ) {
    // PREVENT DUPLICATE PIGMENTS 👇🏻
    if (
      newFormulaComponents.findIndex(
        (component) => component.ComponentCode === receivedComponentCode
      ) !== -1
    ) {
      return;
    }

    const matchingPigment = fetchedPigments?.find(
      (pigment) => pigment.code === receivedComponentCode
    );

    const componentsShallowCopy: FormulaComponentInterface[] =
      newFormulaComponents;
    const componentShallowCopy = {
      ...componentsShallowCopy[receivedIndexComponent],
    };
    componentShallowCopy.ComponentCode = receivedComponentCode;
    // THE RECEIVED COMPONENT CODE COMES FROM THE fetchedPigments ARRAY.
    // THEREFORE, matchingPigment WILL NEVER BE UNDEFINED 👇🏻
    componentShallowCopy.ComponentDescription = matchingPigment!.description;
    componentShallowCopy.hex = matchingPigment!.hex;
    componentsShallowCopy[receivedIndexComponent] = componentShallowCopy;
    setNewFormulaComponents([...componentsShallowCopy]);
    setNewFormulaColor(returnHexColor(componentsShallowCopy, fetchedPigments!));
    // console.log(returnHexColor(componentsShallowCopy, fetchedPigments!));
  }

  async function handleComponentPercentageChange(
    value: string, // Accept value as a string
    receivedIndexComponent: number
  ) {
    const componentsShallowCopy: FormulaComponentInterface[] = [
      ...newFormulaComponents,
    ];
    const componentShallowCopy = {
      ...componentsShallowCopy[receivedIndexComponent],
    };
    componentShallowCopy.Percentage = value;
    componentsShallowCopy[receivedIndexComponent] = componentShallowCopy;
    setNewFormulaComponents([...componentsShallowCopy]);

    setNewFormulaColor(returnHexColor(componentsShallowCopy, fetchedPigments!));
    // console.log(returnHexColor(componentsShallowCopy, fetchedPigments!));
  }

  function handleFormulaWeightChange(value: number) {
    setNewFormulaWeight(value);
  }

  const handleFormulaUnitChange = (value: string) => {
    if (value === "Grams") {
      setFormulaUnit(value);
    }
    if (value === "Percentage") {
      setNewFormulaWeight(100);
      setFormulaUnit(value);
    }
  };

  async function handleAddFormulaComponent() {
    setValidationMessage("");

    if (
      newFormulaComponents.some(
        (formulaComponent) => formulaComponent.ComponentCode === ""
      )
    ) {
      setValidationMessage("Assign all pigments before adding a new component");
      return;
    }

    const newComponentPercentage: number = await returnNewComponentQuantity();

    setNewFormulaComponents((newFormulaComponents) => [
      ...newFormulaComponents,
      {
        FormulaSerie: "",
        FormulaCode: "",
        FormulaDescription: "",
        ComponentCode: "",
        ComponentDescription: "",
        Percentage: String(newComponentPercentage),
      },
    ]);
  }

  async function returnNewComponentQuantity(): Promise<number> {
    const allComponentsQuantitiesSum = newFormulaComponents
      .map((component) => Number(component.Percentage))
      .reduce((a, b) => a + b);
    //console.log("allComponentsQuantitiesSum: ", allComponentsQuantitiesSum);
    const remainingQuantity =
      newFormulaWeight - Number(allComponentsQuantitiesSum);
    return remainingQuantity;
  }

  function handleDeleteFormulaComponent(
    receivedComponent: FormulaComponentInterface
  ) {
    const filteredArray = newFormulaComponents.filter(
      (component) => component.ComponentCode !== receivedComponent.ComponentCode
    );
    setNewFormulaComponents(filteredArray);
  }

  function handleReset() {
    setValidationMessage("");
    setSelectedNewFormulaSeries("");
    setNewFormulaCode("");
    setNewFormulaDescription("");
    setNewFormulaColor("#fff");
    setNewFormulaWeight(100);
    setNewFormulaComponents([
      {
        FormulaSerie: "",
        FormulaCode: "",
        FormulaDescription: "",
        ComponentCode: "ALPHA BASE",
        ComponentDescription: "",
        Percentage: "0",
      },
    ]);
  }

  async function handleSubmit() {
    setValidationMessage("");

    if (
      selectedNewFormulaSeries === "" ||
      newFormulaCode === "" ||
      newFormulaDescription === "" ||
      newFormulaColor === ""
    ) {
      setValidationMessage("Fill out all fields");
      return;
    }

    if (
      newFormulaComponents.some(
        (formulaComponent) => formulaComponent.ComponentCode === ""
      )
    ) {
      setValidationMessage("Select all pigments");
      return;
    }

    const totalPercentages = newFormulaComponents
      .map((component) => Number(component.Percentage))
      .reduce((a, b) => a + b);

    const roundedTotalPercentages = parseFloat(
      Number(totalPercentages).toPrecision(5)
    );

    if (roundedTotalPercentages !== newFormulaWeight) {
      setValidationMessage(
        `Component percentages must add up to exactly ${newFormulaWeight}. Current value is ${roundedTotalPercentages}`
      );
      return;
    }

    const filledNewFormulaComponents = newFormulaComponents.map((component) => {
      return {
        FormulaSerie: selectedNewFormulaSeries,
        FormulaCode: newFormulaCode,
        FormulaDescription: newFormulaDescription,
        ComponentCode: component.ComponentCode,
        ComponentDescription: component.ComponentDescription,
        Percentage: component.Percentage,
      };
    });

    await addOrEditFormula({
      formulaComponents: filledNewFormulaComponents,
      company: localStorage.getItem("userCompany")!,
      createdBy: localStorage.getItem("userEmail")!,
      isEditOrCreate: isEditOrCreate,
      isFormulaActive: isNewFormulaActive,
    });

    refetchFormulas();
    handleReset();
    setSelectedFormula(undefined);
    onOpenChangeCreateFormulaModal(false);
    triggerAddedFormulaNotification();
  }

  // useEffect(() => {}, [newFormulaComponents]);
  useEffect(() => {
    if (isEditOrCreate === "edit" && selectedFormula) {
      setSelectedNewFormulaSeries(selectedFormula.formulaSeries);
      setNewFormulaCode(selectedFormula.formulaCode);
      setNewFormulaDescription(selectedFormula.formulaDescription);
      const mappedComponents = selectedFormula.components.map((component) => {
        return {
          FormulaSerie: selectedNewFormulaSeries,
          FormulaCode: newFormulaCode,
          FormulaDescription: newFormulaDescription,
          ComponentCode: component.componentCode,
          ComponentDescription: component.componentDescription,
          Percentage: String(component.percentage),
        };
      });
      setNewFormulaColor(returnHexColor(mappedComponents, fetchedPigments!));
      setNewFormulaComponents(mappedComponents);
    }

    if (isEditOrCreate === "create") {
      setSelectedNewFormulaSeries("");
      setNewFormulaCode("");
      setNewFormulaDescription("");
      setNewFormulaColor("#fff");
      setNewFormulaWeight(100);
      setNewFormulaComponents([
        {
          FormulaSerie: "",
          FormulaCode: "",
          FormulaDescription: "",
          ComponentCode: "ALPHA BASE",
          ComponentDescription: "",
          Percentage: "",
        },
      ]);
    }
  }, [isEditOrCreate, selectedFormula]);

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
                {isEditOrCreate === "create"
                  ? "Create new formula"
                  : "Edit formula"}
              </ModalHeader>
              <ModalBody>
                {/* <form> */}

                <Select
                  label="Select series"
                  variant="bordered"
                  radius="full"
                  // placeholder="301"
                  isRequired={true}
                  selectedKeys={[selectedNewFormulaSeries]}
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
                  label="Formula code"
                  placeholder="Ex: 100 C"
                  variant="bordered"
                  isRequired={true}
                  value={newFormulaCode}
                  onChange={(event) => {
                    setNewFormulaCode(event.target.value);
                  }}
                />
                <Input
                  //   endContent={
                  //     <FaLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  //   }
                  label="Formula description"
                  placeholder="Ex: 301 OW NEO 100 C"
                  variant="bordered"
                  isRequired={true}
                  value={newFormulaDescription}
                  onChange={(event) => {
                    setNewFormulaDescription(event.target.value);
                  }}
                />
                {isColorPickerVisible ? (
                  <div className={"colorPickerPopover"}>
                    {!isMobile && (
                      <div
                        className={"colorPickerCover"}
                        onClick={() => setIsColorPickerVisible(false)}
                      />
                    )}

                    <ChromePicker
                      color={newFormulaColor}
                      disableAlpha={true}
                      // onChange={handleColorPickerChange}
                    />
                    {isMobile && (
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
                    )}
                  </div>
                ) : null}

                <div
                  className="mt-1"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <p className="mr-auto" style={{ fontWeight: "600" }}>
                    Components
                  </p>

                  <p style={{ opacity: ".7" }}>Color preview: </p>
                  <span
                    className="formulaColorPreview"
                    style={{ background: `${newFormulaColor} content-box` }}
                  ></span>
                </div>
                <Divider className="my-1" />

                <div className="flex flex-col gap-3">
                  <RadioGroup
                    label="Select the measurement unit for the components"
                    value={formulaUnit}
                    onValueChange={handleFormulaUnitChange}
                    orientation="horizontal"
                    // isDisabled={newFormulaWeight === 0}
                  >
                    <Radio
                      classNames={{
                        base: cn(
                          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-1",
                          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                          "data-[selected=true]:border-primary"
                        ),
                      }}
                      value="Grams"
                    >
                      Grams
                    </Radio>
                    <Radio
                      classNames={{
                        base: cn(
                          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-1",
                          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                          "data-[selected=true]:border-primary"
                        ),
                      }}
                      value="Percentage"
                    >
                      Percentage
                    </Radio>
                  </RadioGroup>
                </div>

                <span
                  className={
                    formulaUnit === "Grams"
                      ? "hiddenBlock active-4"
                      : "hiddenBlock"
                  }
                  style={{ width: "50%" }}
                >
                  <Input
                    className="ml-auto"
                    label="Set the formula weight"
                    type="number"
                    min={0}
                    variant="underlined"
                    size="sm"
                    // placeholder="000"
                    labelPlacement="outside"
                    value={String(newFormulaWeight)}
                    onValueChange={(value) => {
                      handleFormulaWeightChange(Number(value));
                    }}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">g</span>
                      </div>
                    }
                  />
                </span>

                {newFormulaComponents.map(
                  (formulaComponent, indexComponent) => {
                    return (
                      <div
                        key={formulaComponent.ComponentCode}
                        style={{ display: "flex" }}
                      >
                        <Button
                          className="my-auto mr-1"
                          variant="light"
                          color="danger"
                          isIconOnly={true}
                          isDisabled={indexComponent === 0}
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
                            selectedKeys={[formulaComponent.ComponentCode]}
                            onChange={(event) =>
                              handleComponentPigmentSelectChange(
                                event.target.value,
                                indexComponent
                              )
                            }
                            isDisabled={newFormulaWeight === 0}
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
                        <span style={{ flex: "1.4" }}>
                          {/* TODO: JOIN THESE 2 INPUTS AND BIND EVERYTHING DYNAMICALLY 👇🏻 */}
                          {formulaUnit === "Grams" ? (
                            <Input
                              type="number"
                              step={0.001}
                              min={0}
                              label="Grams"
                              labelPlacement="inside"
                              value={String(formulaComponent.Percentage)}
                              isDisabled={newFormulaWeight === 0}
                              onValueChange={(value) => {
                                handleComponentPercentageChange(
                                  value,
                                  indexComponent
                                );
                              }}
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-default-400 text-small">
                                    g
                                  </span>
                                </div>
                              }
                            />
                          ) : (
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              step={0.001}
                              label="Percentage"
                              placeholder="0.000"
                              labelPlacement="inside"
                              value={formulaComponent.Percentage} // No need to convert to string
                              isDisabled={newFormulaWeight === 0}
                              onValueChange={(value) => {
                                handleComponentPercentageChange(
                                  value,
                                  indexComponent
                                ); // Pass the value directly
                              }}
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-default-400 text-small">
                                    %
                                  </span>
                                </div>
                              }
                            />
                          )}
                        </span>
                      </div>
                    );
                  }
                )}

                <Button
                  variant="light"
                  color="primary"
                  onPress={handleAddFormulaComponent}
                  isDisabled={newFormulaWeight === 0}
                >
                  + Add component
                </Button>

                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                    radius="full"
                    isSelected={isNewFormulaActive}
                    onValueChange={(value) => {
                      setIsNewFormulaActive(value);
                    }}
                  >
                    Is formula active?
                  </Checkbox>
                  {/* <a color="primary" href="#">
                    Forgot password?
                  </a> */}
                </div>
                {/* </form> */}
                <p
                  style={{ color: "red", textAlign: "center" }}
                  className={
                    validationMessage !== ""
                      ? "validationErrorMessage active"
                      : "validationErrorMessage"
                  }
                >
                  {validationMessage}
                </p>
              </ModalBody>
              <ModalFooter>
                <Tooltip
                  content={
                    <div className="px-1 py-2 text-center">
                      <div className="text-small font-bold ml-auto">
                        ARE YOU SURE?
                      </div>
                      <div className="text-tiny">
                        Clicking this button will revert all changes made
                      </div>
                    </div>
                  }
                >
                  {isEditOrCreate === "create" && (
                    <Button
                      color="danger"
                      variant="light"
                      className="mr-auto"
                      onPress={handleReset}
                    >
                      Reset fields
                    </Button>
                  )}
                </Tooltip>
                <Button color="default" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={handleSubmit}>
                  {isEditOrCreate === "edit" ? "Save changes" : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
