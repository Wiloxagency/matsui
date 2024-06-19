import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Dispatch, SetStateAction, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import "./SendEmailCard.scss";
import { UserInterface } from "../../interfaces/interfaces";

interface SendEmailCardProps {
  setIsSendEmailActive: Dispatch<SetStateAction<boolean>>;
  selectedUsers: UserInterface[] | undefined;
}

export default function SendEmailCard({
  setIsSendEmailActive,
  selectedUsers,
}: SendEmailCardProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = () => {
    console.log(subject, message);
  };

  return (
    <div className="card sendEmailCard">
      <span className="sendEmailCardColumn">
        <div>RECIPIENTS</div>
        <ul className="emailRecipientsContainer">
          {selectedUsers &&
            selectedUsers.map((selectedUser) => {
              return (
                <li key={selectedUser._id}>
                  <span>{selectedUser.email}</span>
                </li>
              );
            })}
          {selectedUsers && selectedUsers.length === 0 && (
            <div>No recipients selected</div>
          )}
        </ul>
      </span>
      <span className="sendEmailCardColumn">
        <div>SUBJECT</div>
        <div>MESSAGE</div>
      </span>
      <span className="sendEmailCardColumn">
        <Input
          type="text"
          variant="bordered"
          value={subject}
          onValueChange={setSubject}
        />
        <Textarea
          variant="bordered"
          minRows={4}
          maxRows={4}
          disableAnimation
          value={message}
          onValueChange={setMessage}
        />
        <Button
          variant="ghost"
          color="danger"
          size="sm"
          startContent={<FaX />}
          onClick={() => {
            setIsSendEmailActive(false);
          }}
        >
          Discard
        </Button>
        <Button
          variant="ghost"
          size="sm"
          startContent={<FaPaperPlane />}
          onClick={handleSendEmail}
        >
          Send
        </Button>
      </span>
    </div>
  );
}
