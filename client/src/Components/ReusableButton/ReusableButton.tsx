import { IconType } from "react-icons";
import "./ReusableButton.scss";
import { Button } from "@nextui-org/button";

interface ReusableButtonProps extends React.ComponentProps<"button"> {
  buttonText: string;
  Icon: IconType;
  handleClick: () => void;
}

export default function ReusableButton({
  buttonText,
  Icon,
  handleClick,
}: ReusableButtonProps) {
  return (
    <Button
      variant="bordered"
      startContent={<Icon></Icon>}
      onPress={handleClick}
    >
      {buttonText}
    </Button>
  );
}
