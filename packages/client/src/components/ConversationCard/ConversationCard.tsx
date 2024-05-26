import './ConversationCard.less';

interface Props {
  id: string;
  name: string;
  onClick?: () => void;
}

export default function ConversationCard({ name, onClick }: Props) {
  return (
    <div className="conversation-card" onClick={onClick}>
      <div className="conversation-card__image">
        <div>{name[0]}</div>
      </div>
      <div className="conversation-card__name">{name}</div>
    </div>
  );
}
