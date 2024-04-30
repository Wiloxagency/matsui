import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.scss";
import logo from "../../assets/matsui_logo.png";
import video from "../../assets/doesthiswork.mp4";
import { randomBytes, scryptSync } from "crypto";

const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginFormMessage, setLoginFormMessage] = useState("");
  // const [emailErrorMessage, setEmailErrorMessage] = useState("");
  // const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (emailRef.current !== null) {
      emailRef.current.focus();
    }
  }, []);

  const handleRegister = async () => {
    setLoginFormMessage("");
    axios
      .post(API_URL + "register", JSON.stringify({ email, password }), {
        headers: { "Content-type": "application/json" },
        // withCredentials: true,
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setLoginFormMessage("Account created. You can now login");
        }
      })
      .catch((error) => {
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
    setLoginFormMessage("");

    axios
      .post(API_URL + "login", JSON.stringify({ email, password }), {
        headers: { "Content-type": "application/json" },
        // withCredentials: true,
      })
      .then((response: AxiosResponse) => {
        navigate("/formulas");
      })
      .catch((error) => {
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
      <video id="myVideo" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
      <div className="bodyBlur"></div>
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
          <button type="submit">Sign in</button>

          {/* <Link to="/formulas"> */}
          <button type="button" onClick={handleRegister} className="newAccount">
            Create new account{" "}
          </button>
          {/* </Link> */}

          <div className="forgotPassword">Forgot your password?</div>
        </form>
      </div>
    </>
  );
}
