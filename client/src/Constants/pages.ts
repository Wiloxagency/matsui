import { FaMoneyBill, FaSwatchbook, FaUserTie } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";

export const pages = [
  {
    path: "/formulas",
    label: "FORMULAS",
    mobileLabel: "Formulas",
    icon: FaSwatchbook,
  },
  {
    path: "/admin",
    label: "ADMIN DASHBOARD",
    mobileLabel: "Admin",
    icon: FaUserTie,
  },
  {
    path: "/calculator",
    label: "INK CALCULATOR",
    mobileLabel: "Calculator",
    icon: FaMoneyBill,
  },
  {
    path: "/import",
    label: "IMPORT FORMULAS",
    mobileLabel: "Import",
    icon: FaCloudArrowUp,
  },
];
