import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import {
  FaClone,
  FaFileExport,
  FaPen,
  FaPrint,
  FaSearch,
} from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import CreateFormulaModal from "../../Components/CreateFormulaModal/CreateFormulaModal";
import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import FormulaPercentagesGraph from "../../Components/FormulaPercentagesGraph/FormulaPercentagesGraph";
import ReusableButton from "../../Components/ReusableButton/ReusableButton";
import Swatches from "../../Components/Swatches/Swatches";
import {
  useGetFormulasQuery,
  useGetInkSystemsQuery,
  useGetPigmentsQuery,
  useGetSeriesQuery,
} from "../../State/api";
import { FormulaInterface } from "../../interfaces/interfaces";
import "./Formulas.scss";

export default function Formulas() {
  const [selectedSeries, setSelectedSeries] = useState<string>("301");
  const [formulaSearchQuery, setFormulaSearchQuery] = useState<string>("");
  const [totalFormulaCost, setTotalFormulaCost] = useState<number>(0);
  const [formulaQuantityAsString, setFormulaQuantityAsString] =
    useState<string>("1000");
  // const [formulaQuantity, setFormulaQuantity] = useState<number>(1000);
  const [formulaUnit, setFormulaUnit] = useState<"g" | "kg" | "lb" | string>(
    "g"
  );

  // const { data: fetchedFormulas, isSuccess: isGetFormulasSuccessful } =
  //   useGetFormulasQuery();

  // const {
  //   data: fetchedFormulaSwatchColors,
  //   isSuccess: isGetFormulaSwatchColorsSuccessful,
  //   refetch: refetchFormulaSwatchColors,
  // } = useGetFormulaSwatchColorsQuery();

  const {
    data: fetchedFormulas,
    isSuccess: isGetFormulasSuccessful,
    refetch: refetchFormulasColors,
  } = useGetFormulasQuery({
    formulaSeries: selectedSeries,
    formulaSearchQuery: formulaSearchQuery,
  });

  const {
    data: fetchedInkSystems,
    isLoading: isGetInkSystemsLoading,
    isSuccess: isGetInkSystemsSuccessful,
  } = useGetInkSystemsQuery();

  const { data: fetchedPigments } = useGetPigmentsQuery();

  const {
    data: fetchedSeries,
    isLoading: isGetSeriesLoading,
    isSuccess: isGetSeriesSuccessful,
  } = useGetSeriesQuery();

  const [selectedFormula, setSelectedFormula] = useState<
    FormulaInterface | undefined
  >();

  // const isSmallScreen = useMediaQuery({ query: "(max-width: 1200px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const {
    isOpen: isOpenCreateFormulaModal,
    onOpen: onOpenCreateFormulaModal,
    onOpenChange: onOpenChangeCreateFormulaModal,
  } = useDisclosure();

  function returnTotalFormulaCost() {
    // console.log(selectedFormula)
    let formulaPrice: number = 0;

    for (const component of selectedFormula!.components) {
      const selectedPigment = fetchedPigments?.filter(
        (pigment) => pigment.code === component.componentCode
      );

      if (selectedPigment && selectedPigment.length > 0) {
        const componentWeight =
          Number(formulaQuantityAsString) * component.percentage;
        const componentPrice =
          (componentWeight * selectedPigment[0].pricePerKg) / 10000;

        // setTotalFormulaCost(totalFormulaCost + componentPrice);

        // updateTotalFormulaCost(componentPrice);
        formulaPrice = parseFloat((formulaPrice + componentPrice).toFixed(3));
      }
    }

    return formulaPrice;
  }

  // const [triggerGetFormulaComponents, { data: getFormulaComponentsData }] = api.endpoints.getFormulaComponents.useLazyQuery();

  const handleFormulaUnitSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormulaUnit(e.target.value);
  };

  const handleSelectSeries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeries(e.target.value);

    // refetchFormulasColors();
  };

  function handleExportFormulas() {
    console.log(fetchedFormulas);
    console.log(fetchedPigments);
  }

  function handleFormulaSearch(
    event?: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent
  ) {
    if (formulaSearchQuery === "") return;
    if (event === undefined) {
      console.log("Search clicked");
      // refetchFormulasColors();
      return;
    }
    if (event && event.key === "Enter") {
      console.log("Pressed enter");
      // refetchFormulasColors();
    }
  }

  // TODO: IMPLEMENT THIS TO PREVENT FORMULAS REFETCHING EVERY TIME
  // A LETTER IS TYPED 👇🏻
  // function handleSearchBarValueChange() {}

  return (
    <>
      <CreateFormulaModal
        isOpenCreateFormulaModal={isOpenCreateFormulaModal}
        onOpenChangeCreateFormulaModal={onOpenChangeCreateFormulaModal}
        fetchedSeries={fetchedSeries}
        fetchedPigments={fetchedPigments}
        refetchFormulaSwatchColors={refetchFormulasColors}
      />
      <div
        className={
          isMobile ? "formulaPageLayout mobileLayout" : "formulaPageLayout"
        }
      >
        <div className="leftSide">
          <div className="sectionHeader">
            <span>FORMULAS</span>
            <Button
              className="ml-auto"
              startContent={<FaFileExport />}
              variant="bordered"
              onClick={handleExportFormulas}
            >
              EXPORT FORMULAS
            </Button>
            <Button
              startContent={<FaPen />}
              color="primary"
              onClick={onOpenCreateFormulaModal}
            >
              CREATE NEW FORMULA
            </Button>
          </div>
          <div className="card">
            {false && (
              <div className="dropdownAndLabelRow">
                <label>INK SYSTEM</label>
                <span className="selectContainer">
                  {/* IDEALLY YOU WOULD ONLY HAVE ONE OF THE 2 FOLLOWING SELECT TAGS.
                I JUST COULDN'T FIGURE OUT HOW TO PREVENT THE SELECTITEM TAG FROM
                GIVING AN ERROR WHEN THE DATA STILL HASN'T BEEN FETCHED */}
                  {isGetInkSystemsLoading && (
                    <Select
                      aria-label="SELECT INK SYSTEM"
                      variant="bordered"
                      radius="full"
                      placeholder="SELECT INK SYSTEM"
                    >
                      <SelectItem key="temp">temp</SelectItem>
                    </Select>
                  )}

                  {isGetInkSystemsSuccessful && (
                    <Select
                      aria-label="SELECT INK SYSTEM"
                      variant="bordered"
                      radius="full"
                      placeholder="SELECT INK SYSTEM"
                      items={fetchedInkSystems}
                    >
                      {(inkSystem) => (
                        <SelectItem key={inkSystem.code}>
                          {inkSystem.name}
                        </SelectItem>
                      )}
                    </Select>
                  )}
                </span>
              </div>
            )}

            <div className="dropdownAndLabelRow">
              <label>SERIES</label>
              <span className="selectContainer">
                {isGetSeriesSuccessful && (
                  <Select
                    aria-label="SELECT SERIES"
                    variant="bordered"
                    radius="full"
                    placeholder="301"
                    value={selectedSeries}
                    onChange={(e) => handleSelectSeries(e)}
                  >
                    {fetchedSeries.map((series) => (
                      <SelectItem
                        key={series.seriesName}
                        value={series.seriesName}
                      >
                        {series.seriesName}
                      </SelectItem>
                    ))}
                    {/* {(series) => (
                    <SelectItem key={series.seriesName}>
                      {series.seriesName}
                    </SelectItem>
                  )} */}
                  </Select>
                )}
                {isGetSeriesLoading && <Spinner className="m-auto" />}
              </span>
            </div>
            <div className="searchBarRow">
              <Input
                type="text"
                variant="bordered"
                placeholder="SEARCH BY COLOR NAME OR CODE"
                radius="full"
                value={formulaSearchQuery}
                onValueChange={setFormulaSearchQuery}
                onKeyUp={(e) => handleFormulaSearch(e)}
                startContent={
                  <FaSearch onClick={() => handleFormulaSearch()} />
                }
              />
            </div>
            <div className="checkboxRow">
              <span>
                <input type="checkbox"></input>
                <label style={{ margin: "0 1rem 0 .5rem" }}>ALL FORMULAS</label>
              </span>
              <span>
                <input type="checkbox"></input>
                <label style={{ margin: "0 1rem 0 .5rem" }}>
                  COMPANY FORMULAS
                </label>
              </span>
            </div>
            <div className="swatchesComponentContainer">
              {isGetFormulasSuccessful ? (
                <Swatches
                  // formulas={formulasInSeries}
                  formulas={fetchedFormulas}
                  selectedFormula={selectedFormula}
                  setSelectedFormula={setSelectedFormula}
                  selectedSeries={selectedSeries}
                />
              ) : (
                <Spinner className="m-auto" />
              )}
            </div>
          </div>
        </div>

        <div className="rightSide">
          <div className="formulaDetailsSection">
            <div
              className={
                isMobile ? "sectionHeader mobileLayout" : "sectionHeader"
              }
            >
              <span style={{ minWidth: "fit-content" }}>
                FORMULA DETAILS:{" "}
                {selectedFormula && selectedFormula.formulaDescription}
              </span>
            </div>
            <div
              className="card"
              style={{ maxWidth: "100vw", marginBottom: "1rem" }}
            >
              {/* TODO: FIGURE OUT HOW TO SHOW THIS SPINNER AFTER A SWATCH IS CLICKED
              BUT BEFORE THE API RESPONSE HAS BEEN RECEIVED 👇🏻 */}
              {/* {selectedFormula !== undefined && (
                <Spinner className="m-auto"></Spinner>
              )} */}
              {selectedFormula !== undefined ? (
                <>
                  {!isMobile && (
                    <FormulaPercentagesGraph formula={selectedFormula} />
                  )}
                  <FormulaDetailsTable
                    formula={selectedFormula}
                    formulaQuantity={parseFloat(formulaQuantityAsString)}
                    formulaUnit={formulaUnit}
                    totalFormulaCost={totalFormulaCost}
                    setTotalFormulaCost={setTotalFormulaCost}
                  />
                  <Divider className="my-4" />
                  <div
                    className="buttonsAndTotalRow"
                    style={{ marginBottom: "1rem" }}
                  >
                    <span style={{ width: "11rem", marginLeft: "auto" }}>
                      <Input
                        maxLength={4}
                        label="QUANTITY"
                        labelPlacement="outside-left"
                        size="sm"
                        fullWidth={false}
                        type="number"
                        value={formulaQuantityAsString}
                        onValueChange={setFormulaQuantityAsString}
                        endContent={
                          <div className="flex items-center">
                            <label className="sr-only" htmlFor="currency">
                              Currency
                            </label>
                            <select
                              className="outline-none border-0 bg-transparent text-default-400 text-small"
                              id="currency"
                              name="currency"
                              value={formulaUnit}
                              onChange={handleFormulaUnitSelectionChange}
                            >
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="lb">lb</option>
                            </select>
                          </div>
                        }
                      />
                    </span>
                    <span className="totalLabel">
                      TOTAL: {returnTotalFormulaCost()} $
                    </span>
                  </div>
                  <div className="buttonsAndTotalRow">
                    <ReusableButton
                      className="underlineButton"
                      buttonText="DUPLICATE FORMULA"
                      Icon={FaClone}
                      handleClick={() => {}}
                    />{" "}
                    <ReusableButton
                      className="underlineButton"
                      buttonText="PRINT FORMULA"
                      Icon={FaPrint}
                      handleClick={() => {}}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* <Spinner className="m-auto" /> */}
                  <span className="m-auto">
                    Click on a formula to see its details
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="similarFormulasSection">
            <div
              className={
                isMobile ? "sectionHeader mobileLayout" : "sectionHeader"
              }
            >
              SIMILAR FORMULAS
            </div>
            <div className="card">
              <span className="m-auto text-center">
                Click on a formula to see similar formulas
                <br />
                (under construction)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
