import { useMediaQuery } from "react-responsive";
import { Outlet, useNavigate } from "react-router-dom";
import BottomBar from "../../Components/BottomBar/BottomBar";
import Header from "../../Components/Header/Header";
import "./MainLayout.scss";
import { useEffect } from "react";
import { Flip, ToastContainer } from "react-toastify";

export default function MainLayout() {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  // console.log("accessToken: ", accessToken);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1200px)" });

  function handleLogout() {
    navigate("/login");
    localStorage.clear();
  }

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, []);

  if (accessToken) {
    return (
      <>
        <ToastContainer transition={Flip} />
        {isSmallScreen ? (
          <BottomBar handleLogout={handleLogout} />
        ) : (
          <Header handleLogout={handleLogout} />
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
    // } else {
    //   navigate("/login");
  }
}
