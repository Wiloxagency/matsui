import { Outlet } from "react-router-dom";
import "./Header.scss";
import logo from "../../assets/matsui_logo.png";
import spectrum from "../../assets/spectrum.png";
import { Link, useMatch } from "react-router-dom";

export default function Header() {
  const isFormulasComponentActive = useMatch("/formulas");

  return (
    <>
      <div className="headerContainer">
        <div className="logoAndNavbar">
          <img src={logo} className="logo" />
          <ul>
            <li
              style={
                isFormulasComponentActive
                  ? { textDecoration: "underline" }
                  : { textDecoration: "none" }
              }
            >
              <Link to="/formulas">FORMULAS</Link>
            </li>
            <li
              style={
                !isFormulasComponentActive
                  ? { textDecoration: "underline" }
                  : { textDecoration: "none" }
              }
            >
              <Link to="/admin">ADMIN DASHBOARD</Link>
            </li>
          </ul>
          <p className="email">Email@email.com</p>
          <Link to="/login" className="logout">
            Log out
          </Link>
        </div>
        <img src={spectrum} className="spectrumBar" />
      </div>
      <div
        className="outletContainer"
        style={
          isFormulasComponentActive
            ? { flexDirection: "row" }
            : { flexDirection: "column" }
        }
      >
        <Outlet />
      </div>
    </>
  );
}
