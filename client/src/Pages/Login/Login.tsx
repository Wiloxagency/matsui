import { FaUser, FaLock } from "react-icons/fa";
import "./Login.scss";
import logo from "../../assets/matsui_logo.png";
import video from "../../assets/doesthiswork.mp4";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/formulas");
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
