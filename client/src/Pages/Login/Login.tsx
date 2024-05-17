import axios, { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import video from "../../assets/doesthiswork.mp4";
import logo from "../../assets/matsui_logo.png";
import "./Login.scss";
import { Button } from "@nextui-org/button";
import { useMediaQuery } from "react-responsive";
const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginFormMessage, setLoginFormMessage] = useState("");
  const [isSignInButtonLoading, setIsSignInButtonLoading] = useState(false);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  // console.log("isMobile: ", isMobile);

  const navigate = useNavigate();

  useEffect(() => {
    if (emailRef.current !== null) {
      emailRef.current.focus();
    }
  }, []);

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
          setLoginFormMessage("Account created. You can now login");
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
        response && navigate("/formulas");
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
          <div className="inputContainer">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              ref={emailRef}
              required
            ></input>
            <FaUser className="icon" />
          </div>
          <div className="inputContainer">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            ></input>
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

          <p
            className={
              loginFormMessage !== ""
                ? "loginFormMessage active"
                : "loginFormMessage"
            }
          >
            {loginFormMessage}
          </p>
          <div>
            <Button type="submit" size="lg" isLoading={isSignInButtonLoading}>
              Sign in
            </Button>
          </div>

          {/* <Link to="/formulas"> */}
          <Button
            type="button"
            className="newAccount"
            size="lg"
            isLoading={isRegisterButtonLoading}
            onClick={handleRegister}
          >
            Create new account{" "}
          </Button>
          {/* </Link> */}

          <div className="forgotPassword">Forgot your password?</div>
        </form>
      </div>
    </>
  );
}
