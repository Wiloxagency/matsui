import { Input } from "@nextui-org/input";
import "./PasswordReset.scss";
import { Button } from "@nextui-org/button";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../../State/api";

export default function PasswordReset() {
  const navigate = useNavigate();
  const params = useParams();
  const encryptedId = params.encryptedId;
  const [newPassword, setNewPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState("");

  const [triggerConfirmPasswordChange] =
    api.endpoints.resetUserPassword.useLazyQuery();

  function handleConfirm() {
    setIsSpinnerVisible(true);
    triggerConfirmPasswordChange({
      encryptedId: encryptedId!,
      newPassword: newPassword,
    })
      .unwrap()
      .then((response: any) => {
        setIsSpinnerVisible(false);
        if (response.message === "Success") {
          setResponseMessage(
            "Password changed! You will be redirected in a few seconds"
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setIsSpinnerVisible(false);
          setResponseMessage(
            "Error resetting password. Please contact your organization"
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setIsSpinnerVisible(false);
        setResponseMessage(
          "Error resetting password. Please contact your organization"
        );
      });
  }

  return (
    // <div className="emailVerificationLayout">
    <div className="passwordResetMainContainer">
      <div className="card m-auto text-center">
        <strong>Reset password</strong>
        <Input
          label="New password"
          type={isPasswordVisible ? "text" : "password"}
          value={newPassword}
          onValueChange={setNewPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        ></Input>
        <p
          className={
            responseMessage !== "" ? "hiddenBlock active-4" : "hiddenBlock"
          }
        >
          {responseMessage}
        </p>
        <Button
          color="primary"
          onPress={handleConfirm}
          isLoading={isSpinnerVisible}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
