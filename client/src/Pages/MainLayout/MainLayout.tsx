import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import BottomBar from "../../Components/BottomBar/BottomBar";
import Header from "../../Components/Header/Header";
import "./MainLayout.scss";

export default function MainLayout() {

  // const accessToken = localStorage.getItem("accessToken");
  // console.log("accessToken: ", accessToken);
  
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1200px)" });

  return (
    <>
      {isSmallScreen ? <BottomBar /> : <Header />}
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
