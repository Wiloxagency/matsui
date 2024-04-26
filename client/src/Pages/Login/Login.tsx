import { FaUser, FaLock } from "react-icons/fa";
import "./Login.scss";
import logo from "../../assets/matsui_logo.png";
import video from "../../assets/doesthiswork.mp4";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (emailRef.current !== null) {
  //     emailRef.current.focus();
  //   }
  // });

  const handleFormSubmit = async (
    formEvent: React.FormEvent<HTMLFormElement>
  ) => {
    formEvent.preventDefault();

    // console.log(email, password);

    axios
      .post(API_URL + "login", JSON.stringify({ email, password }), {
        headers: { "Content-type": "application/json" },
        // withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        if (!error.response) {
          setEmailErrorMessage("No server response");
        } else {
          setEmailErrorMessage("Login failed");
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
        <form onSubmit={handleFormSubmit}>
          <img src={logo} />
          <div className="inputContainer">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              // ref={emailRef}
              required
            ></input>
            <FaUser className="icon" />
          </div>
          <div className="inputContainer">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            ></input>
            <FaLock className="icon" />
          </div>
          <button type="submit">Sign in</button>

          {/* <Link to="/formulas"> */}
          <button type="button" className="newAccount">
            Create new account{" "}
          </button>
          {/* </Link> */}

          <div className="forgotPassword">Forgot your password?</div>
        </form>
      </div>
    </>
  );
}
