import "./Formulas.scss";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  api,
  useGetFormulaSwatchColorsQuery,
  useGetInkSystemsQuery,
  useGetPigmentsQuery,
  useGetSeriesQuery,
} from "../../State/api";
import { FormulaInterface } from "../../interfaces/interfaces";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { FaClone, FaPen, FaPrint, FaSearch } from "react-icons/fa";
import { Spinner } from "@nextui-org/spinner";
import { useDisclosure } from "@nextui-org/modal";
import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import FormulaPercentagesGraph from "../../Components/FormulaPercentagesGraph/FormulaPercentagesGraph";
import ReusableButton from "../../Components/ReusableButton/ReusableButton";
import Swatches from "../../Components/Swatches/Swatches";
import CreateFormulaModal from "../../Components/CreateFormulaModal/CreateFormulaModal";

export default function Formulas() {
  const [formulasInSeries, setFormulasInSeries] = useState<
    string[] | undefined
  >(undefined);
  formulasInSeries;

  const [selectedSeries, setSelectedSeries] = useState<string>("301");

  const [formulaQuantityAsString, setFormulaQuantityAsString] =
    useState<string>("1000");
  // const [formulaQuantity, setFormulaQuantity] = useState<number>(1000);
  const [formulaUnit, setFormulaUnit] = useState<"g" | "kg" | "lb" | string>(
    "g"
  );
  // const { data: fetchedFormulas, isSuccess: isGetFormulasSuccessful } =
  //   useGetFormulasQuery();

  const {
    data: fetchedFormulaSwatchColors,
    isSuccess: isGetFormulaSwatchColorsSuccessful,
    refetch: refetchFormulaSwatchColors,
  } = useGetFormulaSwatchColorsQuery();

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

  // const formulaSeries = Array.from(
  //   new Set(
  //     fetchedFormulas?.map(({ formulaSeries }) => {
  //       return formulaSeries;
  //     })
  //   )
  // ).map((series) => {
  //   return { value: series };
  // });

  // const isSmallScreen = useMediaQuery({ query: "(max-width: 1200px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const {
    isOpen: isOpenCreateFormulaModal,
    onOpen: onOpenCreateFormulaModal,
    onOpenChange: onOpenChangeCreateFormulaModal,
  } = useDisclosure();

  // const [triggerGetFormulaComponents, { data: getFormulaComponentsData }] = api.endpoints.getFormulaComponents.useLazyQuery();


  const [trigger, { data }] =
    api.endpoints.getCodesOfFormulasInSeries.useLazyQuery();

  const handleFormulaUnitSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormulaUnit(e.target.value);
  };

  const handleSelectSeries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    return;
    setSelectedSeries(e.target.value);

    trigger(selectedSeries).then((response) => {
      response;
      data;
    });
  };

  // useEffect(() => {
  //   if (isGetFormulasSuccessful) {
  //     setSelectedFormula(fetchedFormulas[0]);
  //   }
  // }, [fetchedFormulas, isGetFormulasSuccessful]);

  useEffect(() => {
    return;
    setFormulasInSeries(undefined);

    trigger(selectedSeries).then((response) => {
      if (response.data === undefined) return;
      setFormulasInSeries(response.data);
    });
  }, [selectedSeries, trigger]);

  return (
    <>
      <CreateFormulaModal
        isOpenCreateFormulaModal={isOpenCreateFormulaModal}
        onOpenChangeCreateFormulaModal={onOpenChangeCreateFormulaModal}
        fetchedSeries={fetchedSeries}
        fetchedPigments={fetchedPigments}
        refetchFormulaSwatchColors={refetchFormulaSwatchColors}
      />
      <div
        className={
          isMobile ? "formulaPageLayout mobileLayout" : "formulaPageLayout"
        }
      >
        <div className="leftSide">
          <div className="sectionHeader">
            <span>FORMULAS</span>
            <ReusableButton
              className="underlineButton"
              buttonText="CREATE NEW FORMULA"
              Icon={FaPen}
              handleClick={onOpenCreateFormulaModal}
            />
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
              <input type="text" placeholder="SEARCH BY COLOR NAME OR CODE" />
              <FaSearch></FaSearch>
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
              {isGetFormulaSwatchColorsSuccessful ? (
                <Swatches
                  // formulas={formulasInSeries}
                  formulaSwatches={fetchedFormulaSwatchColors}
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
                {selectedFormula && selectedFormula.formulaCode}
              </span>
              <span style={{ width: "14rem" }}>
                <Input
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
                  />
                  <div className="buttonsAndTotalRow">
                    <div style={{ marginBlock: "1rem", marginLeft: "auto" }}>
                      TOTAL: 97,70 $
                    </div>
                    <div className="buttonsContainer">
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
              {/* <div className="swatchesComponentContainer"> */}
              {/* <img
              src="src/assets/underConstruction.jpg"
              className="m-auto rounded-lg"
              // style={{ height: "100%" }}
            ></img> */}
              {/* <Swatches formulas={[]} /> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
