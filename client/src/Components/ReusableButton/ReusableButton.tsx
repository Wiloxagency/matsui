import { IconType } from "react-icons";
import "./ReusableButton.scss";
import { Button } from "@nextui-org/button";

interface ReusableButtonProps extends React.ComponentProps<"button"> {
  buttonText: string;
  Icon: IconType;
}

export default function ReusableButton({
  buttonText,
  Icon,
}: ReusableButtonProps) {
  return (
    <Button variant="bordered" startContent={<Icon></Icon>}>
      {buttonText}
    </Button>
  );
}
