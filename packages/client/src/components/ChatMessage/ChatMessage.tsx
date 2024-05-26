import './ChatMessage.less';

interface Props {
  text: string;
  createdAt: string;
}

export default function Message({ text }: Props) {
  const messageType = 'received';

  return (
    <div className={`message ${messageType}`}>
      <div className="message__content">
        <div className="message__content__sender">Justin</div>
        <div className="message__content__text">{text}</div>
        <p className="message__content__at">
          20:00
        </p>
      </div>
    </div>
  );
}
