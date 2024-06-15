import { useParams } from "react-router-dom";

export default function EmailVerification() {
  const params = useParams();
  const verificationCode = params.verificationCode;
  return <p>{verificationCode}</p>;
}
