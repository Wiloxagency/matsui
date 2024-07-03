import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useState } from "react";
import {
  FaClone,
  FaFileExport,
  FaPen,
  FaPlus,
  FaPrint,
  FaSearch,
} from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import * as XLSX from "xlsx";
import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import FormulaPercentagesGraph from "../../Components/FormulaPercentagesGraph/FormulaPercentagesGraph";
import CreateFormulaModal from "../../Components/Modals/CreateFormulaModal/CreateFormulaModal";
import Swatches from "../../Components/Swatches/Swatches";
import {
  api,
  useAddFormulaMutation,
  useGetFormulasQuery,
  useGetInkSystemsQuery,
  useGetPigmentsQuery,
  useGetSeriesQuery,
  useGetUsersQuery,
} from "../../State/api";
import { returnUniqueCompanies } from "../../Utilities/returnUniqueCompanies";
import { FormulaInterface } from "../../interfaces/interfaces";
import "./Formulas.scss";
import { Flip, ToastContainer, toast } from "react-toastify";

export default function Formulas() {
  const [selectedSeries, setSelectedSeries] = useState<string>("301");
  const [formulaSearchQuery, setFormulaSearchQuery] = useState<string>("");
  const [totalFormulaCost, setTotalFormulaCost] = useState<number>(0);
  const [formulaQuantityAsString, setFormulaQuantityAsString] =
    useState<string>("1000");
  const [formulaUnit, setFormulaUnit] = useState<"g" | "kg" | "lb" | string>(
    "g"
  );
  const [isResetCompanySelectOpen, setIsResetCompanySelectOpen] =
    useState<boolean>();
  const { data: fetchedUsers } = useGetUsersQuery();
  const [companies, setCompanies] = useState<{ name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>();

  const [addFormula] = useAddFormulaMutation();

  const {
    data: fetchedFormulas,
    isSuccess: isGetFormulasSuccessful,
    // isLoading: isGetFormulasLoading,
    refetch: refetchFormulas,
  } = useGetFormulasQuery({
    formulaSeries: selectedSeries,
    formulaSearchQuery: formulaSearchQuery,
    company: selectedCompany,
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

  const [triggerGetSimilarFormulas, { data: fetchedSimilarFormulas }] =
    api.endpoints.getSimilarFormulas.useLazyQuery();

  const [
    triggerGetAllComponents,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { data: _fetchedComponents, isFetching: isGetAllComponentsFetching },
  ] = api.endpoints.getAllComponents.useLazyQuery();

  // const isSmallScreen = useMediaQuery({ query: "(max-width: 1200px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [isEditOrCreateFormula, setIsEditOrCreateFormula] = useState<
    "edit" | "create"
  >("create");

  const {
    isOpen: isOpenCreateFormulaModal,
    onOpen: onOpenCreateFormulaModal,
    onOpenChange: onOpenChangeCreateFormulaModal,
  } = useDisclosure();

  const triggerDuplicatedFormulaNotification = () =>
    toast("😁 Formula duplicated!");

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

  const handleFormulaUnitSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormulaUnit(e.target.value);
  };

  const handleSelectSeries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeries(e.target.value);

    // refetchFormulas();
  };

  function handleExportFormulas() {
    triggerGetAllComponents()
      .unwrap()
      .then((allComponents) => {
        // console.log(allComponents);

        // const revertToOriginalComponentInterface = allComponents.map(
        //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //   ({ _id, hex, isFormulaActive, swatchColor, ...keepAttrs }) => {
        //     return keepAttrs;
        //   }
        // );

        const reorderedComponents = allComponents.map(
          ({
            FormulaCode,
            FormulaDescription,
            ComponentCode,
            ComponentDescription,
            Percentage,
          }) => ({
            FormulaCode,
            FormulaDescription,
            ComponentCode,
            ComponentDescription,
            Percentage,
          })
        );

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(reorderedComponents);
        XLSX.utils.book_append_sheet(workbook, worksheet, "All components");
        XLSX.writeFileXLSX(workbook, "matsui_all_components.xlsx");
      });
  }

  function handleFormulaSearch(
    event?: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent
  ) {
    if (formulaSearchQuery === "") return;
    if (event === undefined) {
      console.log("Search clicked");
      // refetchFormulas();
      return;
    }
    if (event && event.key === "Enter") {
      console.log("Pressed enter");
      // refetchFormulas();
    }
  }

  function handleResetCompanyField() {
    setIsResetCompanySelectOpen(false);
    setSelectedCompany(undefined);
  }

  async function handleDuplicateFormula() {
    if (selectedFormula) {
      const filledNewFormulaComponents = selectedFormula.components.map(
        (component) => {
          return {
            FormulaSerie: selectedFormula.formulaSeries,
            FormulaCode: "COPY: " + selectedFormula.formulaCode,
            FormulaDescription: selectedFormula.formulaDescription,
            ComponentCode: component.componentCode,
            ComponentDescription: component.componentDescription,
            Percentage: String(component.percentage),
            isFormulaActive: selectedFormula.isActive,
          };
        }
      );

      await addFormula({
        formulaComponents: filledNewFormulaComponents,
        company: localStorage.getItem("userCompany")!,
        createdBy: localStorage.getItem("userEmail")!,
      })
        .unwrap()
        .then(() => {
          triggerDuplicatedFormulaNotification();
          refetchFormulas();
        });
    }
  }

  function handleEditOrCreateFormulaClick(option: "edit" | "create") {
    setIsEditOrCreateFormula(option);
    onOpenCreateFormulaModal();
  }

  useEffect(() => {
    if (fetchedUsers) {
      const extractedCompanies = returnUniqueCompanies(fetchedUsers);
      setCompanies(extractedCompanies);
    }
  }, [fetchedUsers]);

  useEffect(() => {
    if (selectedCompany) {
      refetchFormulas();
      // console.log("selectedCompany: ", selectedCompany);
    }
  }, [selectedCompany]);

  // TODO: IMPLEMENT THIS TO PREVENT FORMULAS REFETCHING EVERY TIME
  // A LETTER IS TYPED 👇🏻
  // function handleSearchBarValueChange() {}

  return (
    <>
      <ToastContainer
        containerId="formulaPageToastContainer"
        transition={Flip}
      />

      <CreateFormulaModal
        isOpenCreateFormulaModal={isOpenCreateFormulaModal}
        onOpenChangeCreateFormulaModal={onOpenChangeCreateFormulaModal}
        fetchedSeries={fetchedSeries}
        fetchedPigments={fetchedPigments}
        refetchFormulas={refetchFormulas}
        isEditOrCreate={isEditOrCreateFormula}
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
              isLoading={isGetAllComponentsFetching}
            >
              EXPORT FORMULAS
            </Button>
            <Button
              startContent={<FaPlus />}
              color="primary"
              onPress={() => {
                handleEditOrCreateFormulaClick("create");
              }}
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
            <div className="dropdownAndLabelRow">
              <label>COMPANY</label>

              <span className="selectContainer">
                {!selectedCompany && (
                  <Select
                    aria-label="COMPANY"
                    variant="bordered"
                    radius="full"
                    placeholder="Select a company"
                    onSelectionChange={(keys) =>
                      setSelectedCompany(String(Array.from(keys)[0]))
                    }
                  >
                    {companies.map((company) => (
                      <SelectItem key={company.name}>{company.name}</SelectItem>
                    ))}
                  </Select>
                )}
                {selectedCompany && (
                  <Select
                    isDisabled={selectedCompany === ""}
                    isOpen={isResetCompanySelectOpen}
                    aria-label="COMPANY"
                    variant="bordered"
                    radius="full"
                    placeholder="Select a company"
                    selectedKeys={new Set([selectedCompany!])}
                    endContent={
                      selectedCompany && (
                        <Tooltip content={<p>Reset company field</p>}>
                          <span onClick={handleResetCompanyField}>🗑️</span>
                        </Tooltip>
                      )
                    }
                    onSelectionChange={(keys) =>
                      setSelectedCompany(String(Array.from(keys)[0]))
                    }
                  >
                    {companies.map((company) => (
                      <SelectItem key={company.name}>{company.name}</SelectItem>
                    ))}
                  </Select>
                )}
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
            <div className="swatchesComponentContainer">
              {isGetFormulasSuccessful ? (
                <Swatches
                  // formulas={formulasInSeries}
                  formulas={fetchedFormulas}
                  selectedFormula={selectedFormula}
                  setSelectedFormula={setSelectedFormula}
                  selectedSeries={selectedSeries}
                  triggerGetSimilarFormulas={triggerGetSimilarFormulas}
                />
              ) : (
                <Spinner className="m-auto" />
              )}
              {isGetFormulasSuccessful && fetchedFormulas.length === 0 && (
                <span className="m-auto">
                  No formulas match the selected filters
                </span>
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
              <Button
                startContent={<FaPen />}
                color="primary"
                onPress={() => handleEditOrCreateFormulaClick("edit")}
              >
                EDIT FORMULA
              </Button>
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
                    <Button
                      variant="bordered"
                      startContent={<FaClone />}
                      onPress={handleDuplicateFormula}
                    >
                      DUPLICATE FORMULA
                    </Button>
                    <Button
                      variant="bordered"
                      startContent={<FaPrint />}
                      onPress={() => {}}
                    >
                      PRINT FORMULA
                    </Button>
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
              SIMILAR FORMULAS IN SERIES {selectedSeries}
            </div>
            <div className="card">
              {!fetchedSimilarFormulas && (
                <span className="m-auto text-center">
                  Click on a formula to see similar formulas
                </span>
              )}

              {fetchedSimilarFormulas && (
                <div style={{ maxHeight: "14rem", overflow: " auto" }}>
                  <Swatches
                    formulas={fetchedSimilarFormulas}
                    selectedFormula={selectedFormula}
                    setSelectedFormula={setSelectedFormula}
                    selectedSeries={selectedSeries}
                    triggerGetSimilarFormulas={triggerGetSimilarFormulas}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
