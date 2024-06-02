import type { OnlineUser } from '@/types';

import { history } from 'umi';
import { Button, Dropdown, Menu, Tabs } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import useSession from '@/hooks/useSession';
import ConversationsTab from '../ConversationsTab/ConversationsTab';
import ParticipantsTab from '../ParticipantsTab/ParticipantsTab';

import './Menu.less';

interface Props {
  participants: OnlineUser[];
  handleSelectChat: (id: string) => void;
}

export default function MenuContent({ participants, handleSelectChat }: Props) {
  const { session, logout } = useSession();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="menu-1" onClick={() => history.push('/change-password')}>
        Change password
      </Menu.Item>
      <Menu.Item key="menu-2" onClick={handleLogout}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="app-container__menu__content">
      <header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={() => {}}
            shape="circle"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'lightblue',
            }}
          >
            {session?.name[0]}
          </Button>
          <span style={{ marginLeft: '12px', fontWeight: 500 }}>
            {session?.name}
          </span>
        </div>
        <Dropdown.Button
          overlay={menu}
          icon={(
            <MoreOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              style={{ fontSize: '1.65rem' }}
            />
          )}
        />
      </header>
      <div className="tabs-container">
        <Tabs defaultActiveKey="1" centered>
          <Tabs.TabPane tab="Conversations" key="1">
            <ConversationsTab handleSelectChat={handleSelectChat} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Participants" key="2">
            <ParticipantsTab participants={participants} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}
