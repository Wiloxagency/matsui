import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuth as setAuthAction,
  clearAuth as clearAuthAction,
} from "../State/authSlice";
import { RootState } from "../State/authStore";
import { AuthState } from "../State/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: { email: "", accessToken: null }, // default value to avoid type error
  setAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const setAuth = (value: React.SetStateAction<AuthState>) => {
    if (typeof value === "function") {
      const newState = value(auth);
      if (newState) {
        dispatch(setAuthAction(newState));
      } else {
        dispatch(clearAuthAction());
      }
    } else {
      if (value) {
        dispatch(setAuthAction(value));
      } else {
        dispatch(clearAuthAction());
      }
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const login = () => {
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     await axios.post(
//       `${import.meta.env.VITE_API_URL}/logout`,
//       {},
//       { withCredentials: true }
//     );
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
