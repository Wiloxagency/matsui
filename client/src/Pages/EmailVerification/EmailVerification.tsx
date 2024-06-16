import { useParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../../State/api";

export default function EmailVerification() {
  const params = useParams();
  const verificationCode = params.verificationCode;

  const { data, isSuccess } = useVerifyEmailQuery({
    encryptedId: verificationCode!,
  });
  console.log("data: ", data);

  return (
    <>
      <p>{verificationCode}</p>
      {isSuccess && <p>Email verified!</p>}
    </>
  );
}
