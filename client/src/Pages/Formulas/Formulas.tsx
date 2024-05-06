import { FaClone, FaPen, FaPrint, FaSearch } from "react-icons/fa";
import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import ReusableButton from "../../Components/ReusableButton/ReusableButton";
import Swatches from "../../Components/Swatches/Swatches";
import "./Formulas.scss";

import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import FormulaPercentagesGraph from "../../Components/FormulaPercentagesGraph/FormulaPercentagesGraph";

export default function Formulas() {
  return (
    <>
      <div className="leftSection">
        <div className="sectionHeader">
          <span>FORMULAS</span>
          <ReusableButton
            className="underlineButton"
            buttonText="CREATE NEW FORMULA"
            Icon={FaPen}
          />
        </div>
        <div className="card">
          <div className="dropdownAndLabelRow">
            <label>INK SYSTEM</label>
            <span className="selectContainer">
              <Select
                size="sm"
                variant="bordered"
                radius="full"
                label="SELECT INK SYSTEM"
              >
                <SelectItem key="test">TEST</SelectItem>
              </Select>
            </span>
          </div>
          <div className="dropdownAndLabelRow">
            <label>SERIES</label>
            <span className="selectContainer">
              <Select
                size="sm"
                variant="bordered"
                radius="full"
                label="SELECT SERIES"
              >
                <SelectItem key="test">TEST</SelectItem>
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
            <Swatches />
          </div>
        </div>
      </div>

      <div className="rightSection">
        <div className="formulaDetailsContainer">
          <div className="sectionHeader">
            <span style={{ minWidth: "fit-content" }}>
              FORMULA DETAILS: DC NEO 285 C
            </span>
            {/* <span>
              QUANTITY:
              <input type="number" className="quantityInput" />
              <span style={{ marginLeft: "1rem" }}>g / kg/ lbs</span>
            </span> */}
            <span style={{width: "14rem"}}>
              <Input
                label="QUANTITY"
                placeholder="0.00"
                labelPlacement="outside-left"
                size="sm"
                fullWidth={false}
                endContent={
                  <div className="flex items-center">
                    <label className="sr-only" htmlFor="currency">
                      Currency
                    </label>
                    <select
                      className="outline-none border-0 bg-transparent text-default-400 text-small"
                      id="currency"
                      name="currency"
                    >
                      <option>g</option>
                      <option>kg</option>
                      <option>lbs</option>
                    </select>
                  </div>
                }
                type="number"
              />
            </span>
          </div>
          <div className="card">
            <FormulaPercentagesGraph />
            <FormulaDetailsTable />
            <div className="buttonsAndTotalRow">
              <ReusableButton
                className="underlineButton"
                buttonText="DUPLICATE FORMULA"
                Icon={FaClone}
              />{" "}
              <ReusableButton
                className="underlineButton"
                buttonText="PRINT FORMULA"
                Icon={FaPrint}
              />
              <span>TOTAL: 97,70 $</span>
            </div>
          </div>
        </div>
        <div className="similarFormulasContainer">
          <div className="sectionHeader">SIMILAR FORMULAS</div>
          <div className="card">
            <div className="swatchesComponentContainer">
              <Swatches />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
