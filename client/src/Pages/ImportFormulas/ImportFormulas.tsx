import "./ImportFormulas.scss";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { useState } from "react";
import CustomDropzone from "../../Components/Dropzone/Dropzone";

export default function ImportFormulas() {
  const [isSwitchSelected, setIsSwitchSelected] = useState(true);
  return (
    <>
      <div className="leftSection" style={{ maxWidth: "40vw" }}>
        <div className="sectionHeader">
          <span>STEP 1: UPLOAD FILE</span>
        </div>
        <div className="card">
          <p className="row">Upload an .xls file containing a series.</p>
          <p className="row">You can only upload one series at a time.</p>
          <p className="row">
            Make sure the spreadsheet contains the following information:
          </p>
          <p className="row">
            Formula code, formula description, component code, component
            description, and component percentage.
          </p>
          <div className="row title">SERIES NAME</div>
          <Input type="text" className="row"></Input>
          <div className="row title" style={{ maxWidth: "40vw" }}>
            DOES THE FIRST ROW CONTAIN THE HEADERS?
          </div>
          <Switch
            className="row"
            isSelected={isSwitchSelected}
            onValueChange={setIsSwitchSelected}
          >
            {isSwitchSelected ? "YES" : "NO"}
          </Switch>
          <CustomDropzone />
        </div>
      </div>

      <div className="rightSection">
        <div className="formulaDetailsContainer">
          <div className="sectionHeader">
            <span>STEP 2: MATCH THE COLUMNS TO THE CORRESPONDING VALUES</span>
          </div>
          <div className="card" style={{ maxWidth: "35vw" }}>
            <div className="row title">
              <span style={{ flex: "3" }}>HEADER</span>
              <span style={{ flex: "1" }}>COLUMN</span>
            </div>
            <div className="row">
              <span style={{ flex: "3" }}>FORMULA CODE </span>
              <span style={{ flex: "1" }}>
                <Input type="number" placeholder="0"></Input>
              </span>
            </div>
            <div className="row">
              <span style={{ flex: "3" }}>FORMULA DESCRIPTION</span>
              <span style={{ flex: "1" }}>
                <Input type="number" placeholder="0"></Input>
              </span>
            </div>
            <div className="row">
              <span style={{ flex: "3" }}>COMPONENT CODE</span>
              <span style={{ flex: "1" }}>
                <Input type="number" placeholder="0"></Input>
              </span>
            </div>
            <div className="row">
              <span style={{ flex: "3" }}>COMPONENT DESCRIPTION</span>
              <span style={{ flex: "1" }}>
                <Input type="number" placeholder="0"></Input>
              </span>
            </div>
            <div className="row">
              <span style={{ flex: "3" }}>COMPONENT PERCENTAGE</span>
              <span style={{ flex: "1" }}>
                <Input type="number" placeholder="0"></Input>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
