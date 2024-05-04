import "./Header.scss";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/matsui_logo.png";
import spectrum from "../../assets/spectrum.png";

export default function Header() {
  const location = useLocation();

  // useEffect(() => {
  //   // console.log(location);
  // }, [location]);

  return (
    <>
      <div className="headerContainer">
        <div className="logoAndNavbar">
          <img src={logo} className="logo" />
          <nav>
            <ul>
              <li
                style={
                  location.pathname == "/formulas"
                    ? { textDecoration: "underline" }
                    : { textDecoration: "none" }
                }
              >
                <Link to="/formulas">FORMULAS</Link>
              </li>
              <li
                style={
                  location.pathname == "/admin"
                    ? { textDecoration: "underline" }
                    : { textDecoration: "none" }
                }
              >
                <Link to="/admin">ADMIN DASHBOARD</Link>
              </li>
              <li
                style={
                  location.pathname == "/import"
                    ? { textDecoration: "underline" }
                    : { textDecoration: "none" }
                }
              >
                <Link to="/import">IMPORT FORMULAS</Link>
              </li>
            </ul>
          </nav>

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
          location.pathname == "/formulas"
            ? { flexDirection: "row" }
            : { flexDirection: "column" }
        }
      >
        <Outlet />
      </div>
    </>
  );
}
