import { IconType } from "react-icons";
import { Button } from "@nextui-org/button";

interface ReusableButtonProps extends React.ComponentProps<"button"> {
  buttonText: string;
  Icon: IconType;
  handleClick: () => void;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined
}

export default function ReusableButton({
  buttonText,
  Icon,
  handleClick,
  color
}: ReusableButtonProps) {
  return (
    <Button
      variant="bordered"
      startContent={<Icon></Icon>}
      onPress={handleClick}
      color={color}
    >
      {buttonText}
    </Button>
  );
}
