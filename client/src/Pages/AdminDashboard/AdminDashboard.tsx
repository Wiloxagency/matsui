import { useState } from "react";
import FormulaDetailsTable from "../../Components/FormulaDetailsTable/FormulaDetailsTable";
import Swatches from "../../Components/Swatches/Swatches";
import UsersTable from "../../Components/UsersTable/UsersTable";
import "./AdminDashboard.scss";
import SendEmailCard from "../../Components/SendEmailCard/SendEmailCard";
import ReusableButton from "../../Components/ReusableButton/ReusableButton";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function AdminDashboard() {
  const [isSendEmailActive, setIsSendEmailActive] = useState(false);

  function handleClick() {
    setIsSendEmailActive((previousValue) => !previousValue);
    // console.log(isSendEmailActive);
  }

  return (
    <>
      <div className="topSectionContainer">
        <div className="sectionHeader">
          <span style={{ marginRight: "auto" }}>USER</span>
          <ReusableButton
            style={{ marginRight: "2rem" }}
            className="underlineButton"
            buttonText="SEND EMAIL"
            Icon={FaEnvelope}
            onClick={handleClick}
          />
          <ReusableButton
            className="underlineButton"
            buttonText="RESET PASSWORD"
            Icon={FaLock}
          />
        </div>
        <div className="card">
          <UsersTable />
        </div>
      </div>
      <div
        className="bottomSectionContainer"
        style={
          isSendEmailActive
            ? { flexDirection: "column" }
            : { flexDirection: "row" }
        }
      >
        {isSendEmailActive ? (
          <>
            <div className="sectionHeader">SEND EMAIL</div>
            <SendEmailCard />
          </>
        ) : (
          <>
            <span className="bottomHalf">
              <div className="sectionHeader">USER FORMULAS</div>
              <div className="card">
                <div className="swatchesComponentContainer">
                  <Swatches />
                </div>
              </div>
            </span>
            <span className="bottomHalf">
              <div className="sectionHeader">FORMULA DETAILS: DC NEO 285 C</div>
              <div className="card">
                <FormulaDetailsTable />
              </div>
            </span>
          </>
        )}
      </div>
    </>
  );
}
