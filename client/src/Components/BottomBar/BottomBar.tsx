import { Link } from "react-router-dom";
import { pages } from "../../Constants/pages";
import "./BottomBar.scss";
import { FaSignOutAlt } from "react-icons/fa";
export default function BottomBar() {
  return (
    <>
      <div className="bottomBarContainer">
        <nav>
          <ul>
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <li
                  key={page.path}
                  className={location.pathname === page.path ? "active" : ""}
                >
                  <Link to={page.path}>
                    <Icon className="bottomBarIcon" />
                    <div>{page.mobileLabel}</div>
                  </Link>
                </li>
              );
            })}
            <FaSignOutAlt className="signOutIcon" />
          </ul>
        </nav>
      </div>
    </>
  );
}
