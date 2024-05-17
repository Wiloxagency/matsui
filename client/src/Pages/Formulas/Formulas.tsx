import "./Formulas.scss";
import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import FormulaPercentagesGraph from "../../Components/FormulaPercentagesGraph/FormulaPercentagesGraph";
import ReusableButton from "../../Components/ReusableButton/ReusableButton";
import Swatches from "../../Components/Swatches/Swatches";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";
import { FaClone, FaPen, FaPrint, FaSearch } from "react-icons/fa";
import { useGetFormulasQuery, useGetInkSystemsQuery } from "../../State/api";
// import { tempFormulaSwatches } from "../../State/sampleData";
import { FormulaInterface } from "../../interfaces/interfaces";
import { formulaNames } from "../../State/formulaNames";

export default function Formulas() {
  const [formulaQuantityAsString, setFormulaQuantityAsString] =
    useState<string>("1000");
  // const [formulaQuantity, setFormulaQuantity] = useState<number>(1000);
  const [formulaUnit, setFormulaUnit] = useState<"g" | "kg" | "lb" | string>(
    "g"
  );
  const { data: fetchedFormulas, isSuccess: isGetFormulasSuccessful } =
    useGetFormulasQuery();

  const {
    data: fetchedInkSystems,
    isLoading: isGetInkSystemsLoading,
    isSuccess: isGetInkSystemsSuccessful,
  } = useGetInkSystemsQuery();

  const [selectedFormula, setSelectedFormula] = useState<
    FormulaInterface | undefined
  >();

  const formulaSeries = Array.from(
    new Set(
      fetchedFormulas?.map(({ formulaSeries }) => {
        return formulaSeries;
      })
    )
  ).map((series) => {
    return { value: series };
  });

  const handleFormulaUnitSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormulaUnit(e.target.value);
  };

  useEffect(() => {
    if (isGetFormulasSuccessful) {
      setSelectedFormula(fetchedFormulas[0]);
    }
  }, [fetchedFormulas, isGetFormulasSuccessful]);

  return (
    <>
      <div className="leftSection">
        <div className="sectionHeader">
          <span>FORMULAS</span>
          <ReusableButton
            className="underlineButton"
            buttonText="CREATE NEW FORMULA"
            Icon={FaPen}
            handleClick={() => {}}
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
              <Select
                aria-label="SELECT SERIES"
                variant="bordered"
                radius="full"
                placeholder="SELECT SERIES"
                items={formulaSeries}
              >
                {(series) => (
                  <SelectItem key={series.value}>{series.value}</SelectItem>
                )}
              </Select>
            </span>
          </div>
          <div className="searchBarRow">
            <input type="text" placeholder="SEARCH BY COLOR NAME OR CODE" />
            <FaSearch></FaSearch>
          </div>
          <div className="checkboxRow">
            <input type="checkbox"></input>
            <label style={{ margin: "0 1rem 0 .5rem" }}>ALL FORMULAS</label>
            <input type="checkbox"></input>
            <label style={{ margin: "0 1rem 0 .5rem" }}>COMPANY FORMULAS</label>
          </div>
          <div className="swatchesComponentContainer">
            {isGetFormulasSuccessful ? (
              <Swatches
                // formulas={fetchedFormulas}
                formulas={formulaNames}
                selectedFormula={selectedFormula}
                setSelectedFormula={setSelectedFormula}
              />
            ) : (
              <Spinner className="m-auto" />
            )}
          </div>
        </div>
      </div>

      <div className="rightSection">
        <div className="formulaDetailsContainer">
          <div className="sectionHeader">
            <span style={{ minWidth: "fit-content" }}>
              FORMULA DETAILS: {selectedFormula && selectedFormula.formulaCode}
            </span>
            {/* <span>
              QUANTITY:
              <input type="number" className="quantityInput" />
              <span style={{ marginLeft: "1rem" }}>g / kg/ lbs</span>
            </span> */}
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
          <div className="card">
            {selectedFormula !== undefined ? (
              <>
                <FormulaPercentagesGraph formula={selectedFormula} />
                <FormulaDetailsTable
                  formula={selectedFormula}
                  formulaQuantity={parseFloat(formulaQuantityAsString)}
                  formulaUnit={formulaUnit}
                />
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
                  <span>TOTAL: 97,70 $</span>
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
        <div className="similarFormulasContainer">
          <div className="sectionHeader">SIMILAR FORMULAS</div>
          <div className="card">
            <div className="swatchesComponentContainer">
              {/* <Swatches formulas={[]} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
