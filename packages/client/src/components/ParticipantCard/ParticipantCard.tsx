import type { OnlineUser } from '@/types';

import './ParticipantCard.less';

interface Props {
  participant: OnlineUser;
}

export default function ParticipantCard({ participant }: Props) {
  return (
    <div className="participant-card">
      <div className="participant-card__image">
        <div>{participant.name[0]}</div>
      </div>
      <div className="participant-card__name">
        <span style={{ marginRight: 'auto' }}>{participant.name}</span>
      </div>
    </div>
  );
}
