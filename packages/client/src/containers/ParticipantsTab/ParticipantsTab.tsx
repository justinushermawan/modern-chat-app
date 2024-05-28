import type { OnlineUser } from '@/types';

import ParticipantCard from '@/components/ParticipantCard/ParticipantCard';

import './ParticipantsTab.less';

interface Props {
  participants: OnlineUser[];
}

export default function ParticipantsTab({ participants }: Props) {
  return (
    <>
      <div className="participants-tab">
        <div className="participants-list">
          {participants.map((participant, index) => (
            <ParticipantCard key={index} participant={participant} />
          ))}
        </div>
      </div>
    </>
  );
}
