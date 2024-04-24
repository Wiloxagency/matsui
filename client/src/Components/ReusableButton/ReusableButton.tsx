import { IconType } from "react-icons";
import "./ReusableButton.scss";

interface ReusableButtonProps extends React.ComponentProps<"button"> {
  buttonText: string;
  Icon: IconType;
}

export default function ReusableButton({
  buttonText,
  Icon,
  ...props
}: ReusableButtonProps) {
  return (
    <button {...props}>
      {buttonText}
      <Icon></Icon>
    </button>
  );
}
