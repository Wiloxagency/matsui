import { Button } from "@nextui-org/button";
import axios, { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/AuthProvider";
import video from "../../assets/doesthiswork.mp4";
import logo from "../../assets/matsui_logo.png";
import "./Login.scss";
import { api } from "../../State/api";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
const API_URL = import.meta.env.VITE_API_URL;

const forbiddenProviders = ["gmail", "hotmail", "outlook", "yahoo"];

export function Login() {
  // const { setAuth } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginFormMessage, setLoginFormMessage] = useState("");
  const [isSignInButtonLoading, setIsSignInButtonLoading] = useState(false);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const [isProviderAllowed, setIsProviderAllowed] = useState<boolean>(true);
  const [triggerSendEmail] = api.endpoints.sendEmail.useLazyQuery();
  const [isRegistrationModeActive, setIsRegistrationModeActive] =
    useState<boolean>(false);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  // console.log("isMobile: ", isMobile);

  const navigate = useNavigate();

  function handleSetEmail(receivedEmail: string) {
    setEmail(receivedEmail);
    const provider = getEmailProvider(receivedEmail);
    setIsProviderAllowed(!forbiddenProviders.includes(provider));
  }

  function getEmailProvider(email: string): string {
    const parts = email.split("@");
    // If there is no "@" or nothing after "@", return an empty string
    if (parts.length !== 2 || parts[1].length === 0) {
      return "";
    }
    const domainParts = parts[1].split(".");
    return domainParts[0];
  }

  const handleRegister = async () => {
    setIsRegisterButtonLoading(true);
    setLoginFormMessage("");
    axios
      .post(API_URL + "register", JSON.stringify({ email, password }), {
        headers: { "Content-type": "application/json" },
        // withCredentials: true,
      })
      .then((response: AxiosResponse) => {
        setIsRegisterButtonLoading(false);
        if (response.status === 200) {
          setLoginFormMessage("Account created. Check your email to verify it");
        }
      })
      .catch((error) => {
        setIsRegisterButtonLoading(false);
        if (!error.response) {
          setLoginFormMessage("No server response");
        } else if (error.response.status === 401) {
          setLoginFormMessage("Email already registered");
        } else {
          setLoginFormMessage("Unable to register. Please try again x2");
        }
      });
  };

  const handleLogin = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    setIsSignInButtonLoading(true);
    setLoginFormMessage("");

    axios
      .post(API_URL + "login", JSON.stringify({ email, password }), {
        headers: { "Content-type": "application/json" },
        // withCredentials: true,
      })
      .then((response: AxiosResponse) => {
        setIsSignInButtonLoading(false);

        if (response.data.message === "User unverified") {
          setLoginFormMessage("Please confirm your email before logging in");
          return;
        } else {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userCompany", response.data.userCompany);
          if (response.data.isAdmin) {
            localStorage.setItem("isAdmin", response.data.isAdmin);
          }
          // const accessToken = response.data.accessToken;
          // accessToken;
          // TODO: MAKE THIS WORK 👇🏻
          // setAuth({
          //   email: response.data.email,
          //   accessToken: response.data.accessToken,
          // });
          // console.log("accessToken: ", accessToken);
          navigate("/formulas");
        }
      })
      .catch((error) => {
        setIsSignInButtonLoading(false);
        if (!error.response) {
          setLoginFormMessage("No server response");
        } else {
          setLoginFormMessage("Wrong email or password");
        }
      });
  };

  function handleCreateNewAccount() {
    setIsRegistrationModeActive(true);
    return;
    handleRegister();
  }

  function handleResetPassword() {
    if (email === "") {
      setLoginFormMessage("Type your email to reset your password");
      return;
    }

    setLoginFormMessage("");

    const sendEmailPayload = {
      recipients: [email],
      subject: "",
      message: "",
      isResetPasswordEmail: true,
    };

    triggerSendEmail(sendEmailPayload)
      .unwrap()
      .then((payload: any) => {
        if (payload.message === "Message sent") {
          setLoginFormMessage(`Email sent to ${email}`);
        }
      })
      .catch((error) => console.error("rejected", error));
  }

  useEffect(() => {
    if (emailRef.current !== null) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="backgroundColor"></div>
      {!isMobile && (
        <>
          <video id="myVideo" autoPlay loop muted>
            <source src={video} type="video/mp4" />
          </video>
          <div className="bodyBlur"></div>
        </>
      )}
      <div className="loginFormCard">
        <form onSubmit={handleLogin}>
          <img src={logo} />
          <p
            className={
              isProviderAllowed
                ? "mb-4 hiddenBlock"
                : "mb-4 hiddenBlock active-2"
            }
          >
            Only business emails are allowed
          </p>
          <div className="inputContainer">
            <Input
              radius="full"
              type="email"
              label="Email"
              value={email}
              onChange={(event) => handleSetEmail(event.target.value)}
              ref={emailRef}
              required
              endContent={<FaUser className="icon" />}
            ></Input>
          </div>
          <div className="inputContainer">
            <Input
              label="Password"
              radius="full"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            ></Input>
            <FaLock className="icon" />
            {isPasswordVisible ? (
              <FaEyeSlash
                className="icon eyeIcons"
                onClick={() => setIsPasswordVisible(false)}
              />
            ) : (
              <FaEye
                className="icon eyeIcons"
                onClick={() => setIsPasswordVisible(true)}
              />
            )}
          </div>
          {isRegistrationModeActive && (
            <div className="inputContainer">
              <Input
                label="Phone"
                radius="full"
                required
                endContent={<FaPhone className="icon" />}
              ></Input>
            </div>
          )}

          {isRegistrationModeActive && (
            <Select
              label="Supplier"
              size="lg"
              classNames={{
                label: "text-white",
                value: "text-white",
              }}
              aria-label="SELECT SUPPLIER"
              variant="bordered"
              radius="full"
              placeholder="Select supplier"
              color="primary"
            >
              <SelectItem key="temp">Good Paints</SelectItem>
              <SelectItem key="temp">Curated Colors</SelectItem>
              <SelectItem key="temp">Chatoyancy Co.</SelectItem>
            </Select>
          )}

          <p
            className={
              loginFormMessage !== "" ? "hiddenBlock active-2" : "hiddenBlock"
            }
          >
            {loginFormMessage}
          </p>
          {!isRegistrationModeActive && (
            <div>
              <Button type="submit" size="lg" isLoading={isSignInButtonLoading}>
                Sign in
              </Button>
            </div>
          )}

          {/* <Link to="/formulas"> */}
          <Button
            type="button"
            className="newAccount"
            size="lg"
            isLoading={isRegisterButtonLoading}
            onClick={handleCreateNewAccount}
            isDisabled={email === "" || password === "" || !isProviderAllowed}
          >
            Create new account{" "}
          </Button>
          {/* </Link> */}

          {!isRegistrationModeActive && (
            <div className="forgotPassword" onClick={handleResetPassword}>
              Forgot your password? Click here to reset it
            </div>
          )}
          {isRegistrationModeActive && (
            <div
              className="forgotPassword"
              onClick={() => setIsRegistrationModeActive(false)}
            >
              Already have an account? Sign in instead
            </div>
          )}
        </form>
      </div>
    </>
  );
}
