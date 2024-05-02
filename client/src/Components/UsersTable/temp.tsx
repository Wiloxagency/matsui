import React from "react";
import { Input } from "@nextui-org/input";

class TextInput extends React.Component {
  textInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.textInputRef = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    this.textInputRef.current!.focus();
  }

  render() {
    return (
      <div>
        <Input
          type="text"
          ref={this.textInputRef}
          onClick={this.focusTextInput}
          size="sm"
          aria-label="Default msg"
        />
      </div>
    );
  }
}
export default TextInput;
