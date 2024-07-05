import "./Header.scss";
import { Link, useLocation } from "react-router-dom";
import { pages } from "../../Constants/pages";
import logo from "../../assets/matsui_logo.png";
import spectrum from "../../assets/spectrum.png";

interface HeaderProps {
  handleLogout: () => void;
}

export default function Header({ handleLogout }: HeaderProps) {
  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail");
  const isAdmin = localStorage.getItem("isAdmin");
  const userCompany = localStorage.getItem("userCompany");

  return (
    <div className="headerContainer">
      <div className="logoAndNavbar">
        <img src={logo} className="logo" />
        <nav>
          <ul>
            {pages.map((page) => {
              if (page.path === "/admin" && !isAdmin) return;
              if (page.path === "/import" && !isAdmin) return;
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

        <p className="email">{userEmail}</p>
        <p className="company">({userCompany})</p>
        <p className="logout" onClick={handleLogout}>
          Log out
        </p>
      </div>
      <img src={spectrum} className="spectrumBar" />
    </div>
  );
}
