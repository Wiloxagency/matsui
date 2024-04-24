import "./SendEmailCard.scss";

export default function SendEmailCard() {
  return (
    <div className="card sendEmailCard">
      <span className="sendEmailCardColumn">
        <div>RECIPIENTS</div>
        <ul>
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
      </span>
    </div>
  );
}
