import "./Header.scss";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/matsui_logo.png";
import spectrum from "../../assets/spectrum.png";
import { useMediaQuery } from "react-responsive";

export default function Header() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const pages = [
    { path: "/formulas", label: "FORMULAS" },
    { path: "/admin", label: "ADMIN DASHBOARD" },
    { path: "/import", label: "IMPORT FORMULAS" },
  ];

  const location = useLocation();

  return (
    <>
      {isMobile ? (
        <></>
      ) : (
        <div className="headerContainer">
          <div className="logoAndNavbar">
            <img src={logo} className="logo" />
            <nav>
              <ul>
                {pages.map((page) => {
                  return (
                    <li
                      key={page.path}
                      style={
                        location.pathname === page.path
                          ? { textDecoration: "underline" }
                          : { textDecoration: "none" }
                      }
                    >
                      <Link to={page.path}>{page.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <p className="email">Email@email.com</p>
            <Link to="/login" className="logout">
              Log out
            </Link>
          </div>
          <img src={spectrum} className="spectrumBar" />
        </div>
      )}
      <div
        className="outletContainer"
        // style={
        //   location.pathname == "/formulas" || location.pathname == "/import"
        //     ? { flexDirection: "row" }
        //     : { flexDirection: "column" }
        // }
      >
        <Outlet />
      </div>
    </>
  );
}
