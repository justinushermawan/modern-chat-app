import type { Message } from '@/types';

import { Button, Tooltip } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

import useSession from '@/hooks/useSession';

import './ChatMessage.less';

interface Props {
  data: Message;
}

export default function Message({ data }: Props) {
  const { user, content, replies, parent, createdAt } = data;

  const { session } = useSession();

  const isReply = parent !== null;

  const isMe = user._id === session?.id;
  const messageType = isMe && !isReply ? 'sent' : 'received';

  return (
    <div className={`message ${messageType}`}>
      <div>
        <div className="message__content" style={isReply ? { backgroundColor: 'rgb(217, 239, 204)' } : undefined}>
          <div className="message__content__sender">{isMe && isReply ? 'You' : user.name}</div>
          <div className="message__content__text">{content}</div>
          <p className="message__content__at">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        {replies.length > 0 && (
          <div
            className="message__replies"
            style={
              messageType === 'sent'
                ? { paddingRight: '12px' }
                : { paddingLeft: '12px' }
            }
          >
            {replies.map((reply) => (
              <Message key={reply._id} data={reply} />
            ))}
          </div>
        )}
      </div>
      <Tooltip title="Reply">
        <Button
          shape="circle"
          icon={<RollbackOutlined />}
          style={{ margin: '0 8px' }}
        />
      </Tooltip>
    </div>
  );
}
