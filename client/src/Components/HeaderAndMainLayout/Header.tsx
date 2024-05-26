import "./Header.scss";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/matsui_logo.png";
import spectrum from "../../assets/spectrum.png";
import { useMediaQuery } from "react-responsive";
import BottomBar from "../BottomBar/BottomBar";
import { pages } from "../../Constants/pages";

export default function Header() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1200px)" });

  const location = useLocation();

  return (
    <>
      {isSmallScreen ? (
        <BottomBar />
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
        className={
          isMobile ? "outletContainer mobileLayout" : "outletContainer"
        }
      >
        <Outlet />
      </div>
    </>
  );
}
