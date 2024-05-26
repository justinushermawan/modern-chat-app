import { Button } from 'antd';
import './ConversationsTab.less';
import ConversationCard from '@/components/ConversationCard/ConversationCard';

interface Props {
  handleSelectChat: (id: string) => void;
}

export default function ConversationsTab({ handleSelectChat }: Props) {
  return (
    <>
      <div className="conversations-tab">
        <div className="conversations-list">
          <ConversationCard id="1" name="Public" onClick={() => handleSelectChat('1')} />
        </div>
        <Button onClick={() => {}}>New conversation</Button>
      </div>
    </>
  );
}
