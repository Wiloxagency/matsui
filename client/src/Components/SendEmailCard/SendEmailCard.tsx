import { Button } from "@nextui-org/button";
import "./SendEmailCard.scss";
import { FaArrowUpShortWide, FaX } from "react-icons/fa6";
import { FaArrowUp, FaPaperPlane } from "react-icons/fa";

export default function SendEmailCard() {
  return (
    <div className="card sendEmailCard">
      <span className="sendEmailCardColumn">
        <div>RECIPIENTS</div>
        <ul className="emailRecipientsContainer">
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
          <li>
            <span>Anthony Hopkins</span>
            <span>anthopkins@email.com</span>
          </li>
        </ul>
      </span>
      <span className="sendEmailCardColumn">
        <div>TITLE</div>
        <div>MESSAGE</div>
      </span>
      <span className="sendEmailCardColumn">
        <input type="text" />
        <textarea />
        <Button variant="ghost" color="danger" size="sm" startContent={<FaX />}>
          Discard
        </Button>
        <Button variant="ghost" size="sm" startContent={<FaPaperPlane />}>
          Send
        </Button>
      </span>
    </div>
  );
}
