import "./EmailVerification.scss";
import { Link, useParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../../State/api";
import { Spinner } from "@nextui-org/spinner";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const navigate = useNavigate();
  const params = useParams();
  const verificationCode = params.verificationCode;

  const { data, isSuccess, isError, isFetching } = useVerifyEmailQuery({
    encryptedId: verificationCode!,
  });

  if (isSuccess) {
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }
  console.log("data: ", data);

  return (
    <div className="emailVerificationLayout">
      <div className="card m-auto text-center">
        {isFetching && <Spinner></Spinner>}
        {isSuccess && (
          <>
            <p style={{ fontSize: "3rem" }}>✔️</p>
            <p>Email verified! You will be redirected in a few seconds</p>
          </>
        )}
        {isError && (
          <>
            <p style={{ fontSize: "3rem" }}>❌</p>
            <p className="mb-4">
              Couldn't validate your account. Please try again later
            </p>
            <Link className="mt-4" to={"/login"}>
              Click here to go to the login page
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
