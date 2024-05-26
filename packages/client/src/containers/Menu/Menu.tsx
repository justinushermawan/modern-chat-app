import { Button, Dropdown, Menu, Tabs } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import './Menu.less';
import ConversationsTab from '../ConversationsTab/ConversationsTab';
import ParticipantsTab from '../ParticipantsTab/ParticipantsTab';

interface Props {
  handleSelectChat: (id: string) => void;
}

export default function MenuContent({ handleSelectChat }: Props) {
  const menu = (
    <Menu>
      <Menu.Item key="menu-1" onClick={() => {}}>
        Change profile image
      </Menu.Item>
      <Menu.Item key="menu-2" onClick={() => {}}>
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
            J
          </Button>
          <span style={{ marginLeft: '12px', fontWeight: 500 }}>
            Justinus Hermawan
          </span>
        </div>
        <Dropdown.Button
          overlay={menu}
          icon={<MoreOutlined style={{ fontSize: '1.65rem' }} />}
        />
      </header>
      <div className="tabs-container">
        <Tabs defaultActiveKey="1" centered>
          <Tabs.TabPane tab="Conversations" key="1">
            <ConversationsTab handleSelectChat={handleSelectChat} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Participants" key="2">
            <ParticipantsTab />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}
