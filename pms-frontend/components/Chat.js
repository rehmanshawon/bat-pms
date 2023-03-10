import {
  ApiTwoTone,
  AudioTwoTone,
  CopyTwoTone,
  FileImageTwoTone,
  HeartTwoTone,
  MessageTwoTone,
  PushpinTwoTone,
  SearchOutlined,
  SettingTwoTone,
  StarTwoTone,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Input, Layout, List, Menu, Row } from "antd";
import Link from "next/link";
import ChatStyled from "./styles/Chat";
import format from "date-fns/format";
import styled from "styled-components";
import { useAppState } from "./shared/AppProvider";
import { useState } from "react";

const { Sider, Header } = Layout;
const { TextArea, Search } = Input;
const { SubMenu } = Menu;

const Fab = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 40px;
  right: 2rem;
  padding: 0 2rem;
  margin-bottom: 2rem;
`;

const Chat = () => {
  const [state, dispatch] = useAppState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profile, setProfile] = useState(false);
  const [contacts, setContacts] = useState(false);

  const messageHeader = (
    <Menu mode="horizontal" className="border-0 m-auto">
      <Menu.Item key="read">
        <Link href="/">
          <a>
            <PushpinTwoTone style={{ fontSize: "20px" }} />
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="favorite">
        <Link href="/">
          <a>
            <HeartTwoTone style={{ fontSize: "20px" }} />
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="star">
        <Link href="/">
          <a>
            <StarTwoTone style={{ fontSize: "20px" }} />
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="refresh">
        \
        <Link href="/">
          <a>
            <CopyTwoTone style={{ fontSize: "20px" }} />
          </a>
        </Link>
      </Menu.Item>
    </Menu>
  );

  const messageFooter = (
    <div className="py-3 px-3">
      <Search placeholder="Search contact" />
    </div>
  );

  const messagesSidebar = (
    <List
      className="scroll-y flex-1 bg-transparent"
      itemLayout="horizontal"
      dataSource={MockContacts}
      renderItem={(item, index) => (
        <List.Item
          onClick={() => setSelectedIndex(index)}
          style={{
            backgroundColor: selectedIndex === index ? "#e6f7ff" : "",
          }}
          className={`${
            selectedIndex === index ? "" : "border-0"
          } border-0 px-4 py-3`}
        >
          <List.Item.Meta
            avatar={item.avatar}
            title={
              <small
                css={`
                  display: flex;
                  width: 100%;
                `}
              >
                <span
                  className={`${
                    selectedIndex === index ? "ant-menu-item-selected" : ""
                  } `}
                >
                  {item.name}
                </span>
              </small>
            }
            description={<span>{item.status}</span>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <Layout className="fill-workspace rounded shadow-sm overflow-hidden">
      <Header
        css={`
          display: flex;
          align-items: center;
          padding: 0.3rem 2rem;
          z-index: 1;
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(0, 0, 0, 0.02);
          height: auto;
          line-height: auto;
        `}
      >
        {state.mobile && (
          <Button
            shape="circle"
            size="large"
            onClick={() => setContacts(true)}
            className="mr-3"
          >
            <MessageTwoTone style={{ fontSize: "20px" }} />
          </Button>
        )}
        <Row type="flex" align="middle">
          <Avatar shape="circle" size={40} src="/images/avatar.jpg" />
          {!state.mobile && (
            <span
              className="mx-3"
              css={`
                line-height: 1;
              `}
            >
              <span
                css={`
                  display: block;
                `}
              >
                John Doe
              </span>
              <small className="text-muted">
                <span>Online</span>
              </small>
            </span>
          )}
        </Row>
        <span className="mr-auto" />
        <Menu mode="horizontal" className="border-0">
          <Menu.Item>
            <SearchOutlined style={{ fontSize: "20px" }} />
          </Menu.Item>
          <Menu.Item>
            <SettingTwoTone style={{ fontSize: "20px" }} />
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        {!state.mobile && (
          <Sider width={300}>
            <div
              css={`
                display: flex;
                flex: 1;
                flex-direction: column;
                height: 100%;
                border-right: 1px solid rgba(0, 0, 0, 0.05);
              `}
            >
              {messageHeader}
              {messagesSidebar}
              {messageFooter}
            </div>
          </Sider>
        )}
        <Drawer
          title={messageHeader}
          closable={false}
          width={240}
          placement="left"
          onClose={() => setContacts(false)}
          visible={contacts}
          className="chat-drawer"
        >
          <div
            css={`
              display: flex;
              flex: 1;
              flex-direction: column;
              height: 100%;
              overflow: hidden;
            `}
          >
            {messagesSidebar}
            {messageFooter}
          </div>
        </Drawer>
        <Layout>
          <div
            css={`
              display: flex;
              flex: 1;
              flex-direction: column;
              height: 100%;
              overflow: hidden;
            `}
          >
            <ChatStyled>
              <>
                {MockChats.map((chat, index) => (
                  <div
                    key={index}
                    className={`conversation
                        ${
                          chat.type === "sent"
                            ? "conversation-sent"
                            : "conversation-received"
                        }
                      `}
                  >
                    <div
                      className={`
                          body shadow-sm
                          ${
                            chat.type === "sent"
                              ? "body-sent"
                              : "body-received text-body"
                          }
                        `}
                    >
                      <p color="inherit">{chat.message}</p>
                      <p
                        variant="caption"
                        className={`
                            date
                            ${
                              chat.type === "sent"
                                ? "date-sent"
                                : "date-received"
                            }
                          `}
                      >
                        {format(chat.date, "hh:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            </ChatStyled>
            <div
              className="px-3 py-2"
              css={`
                background: #f9f9f9;
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <Menu
                  mode="horizontal"
                  className="border-bottom-0 bg-transparent"
                >
                  <Menu.Item key="read">
                    <Link href="/">
                      <a>
                        <FileImageTwoTone style={{ fontSize: "20px" }} />
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="favorite">
                    <Link href="/">
                      <a>
                        <ApiTwoTone style={{ fontSize: "20px" }} />
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="star">
                    <Link href="/">
                      <a>
                        <AudioTwoTone style={{ fontSize: "20px" }} />
                      </a>
                    </Link>
                  </Menu.Item>
                </Menu>

                <TextArea placeholder="Type a message" autoSize />
              </div>
            </div>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Chat;
