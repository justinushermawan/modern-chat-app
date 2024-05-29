import './ChatMessage.less';

interface Props {
  text: string;
  createdBy: string;
  createdAt: string;
}

export default function Message({ text, createdBy, createdAt }: Props) {
  const messageType = 'received';

  return (
    <div className={`message ${messageType}`}>
      <div className="message__content">
        <div className="message__content__sender">{createdBy}</div>
        <div className="message__content__text">{text}</div>
        <p className="message__content__at">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
