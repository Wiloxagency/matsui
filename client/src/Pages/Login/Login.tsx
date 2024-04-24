import { FaUser, FaLock } from "react-icons/fa";
import "./Login.scss";
import logo from "../../assets/matsui_logo.png";
import video from "../../assets/doesthiswork.mp4";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const navigate = useNavigate();
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .get(API_URL)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log(error));
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
            <input type="text" placeholder="Email" required></input>
            <FaUser className="icon" />
          </div>
          <div className="inputContainer">
            <input type="password" placeholder="Password" required></input>
            <FaLock className="icon" />
          </div>
          <button type="submit">Sign in</button>

          <Link to="/formulas">
            <button type="button" className="newAccount">
              Create new account{" "}
            </button>
          </Link>

          <div className="forgotPassword">Forgot your password?</div>
        </form>
      </div>
    </>
  );
}
