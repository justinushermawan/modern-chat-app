import useSession from '@/hooks/useSession';

import './ChatMessage.less';

interface Props {
  text: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

export default function Message({ text, createdById, createdByName, createdAt }: Props) {
  const { session } = useSession();

  const messageType = createdById === session?.id ? 'sent' : 'received';

  return (
    <div className={`message ${messageType}`}>
      <div className="message__content">
        <div className="message__content__sender">{createdByName}</div>
        <div className="message__content__text">{text}</div>
        <p className="message__content__at">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
