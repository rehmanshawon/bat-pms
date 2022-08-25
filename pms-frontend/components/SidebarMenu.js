import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Dropdown,
  Layout,
  List,
  Menu,
  Popconfirm,
  Row,
  Switch,
  Tooltip,
} from "antd";
import {
  FolderTwoTone,
  PlaySquareTwoTone,
  PushpinTwoTone,
} from "@ant-design/icons";
import { capitalize, lowercase } from "../apsisEngine/helpers/helpers";
import { useEffect, useState } from "react";

import DashHeader from "./styles/Header";
import Inner from "./styles/Sidebar";
import Link from "next/link";
import { useAppState } from "./shared/AppProvider";
import { withRouter } from "next/router";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { async } from "rxjs";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

let rootSubMenuKeys = [];
const UserMenu = (
  <Menu>
    <Menu.Item>Settings</Menu.Item>
    <Menu.Item>Profile</Menu.Item>
    <Menu.Item>Notifications</Menu.Item>
  </Menu>
);

const SidebarContent = ({
  sidebarTheme,
  sidebarMode,
  sidebarIcons,
  collapsed,
  router,
}) => {
  const [state, dispatch] = useAppState();
  const [openKeys, setOpenKeys] = useState([]);
  const [appRoutes, setAppRoutes] = useState([]);
  const { pathname } = router;

  const badgeTemplate = (badge) => (
    <Badge
      count={badge.value}
      className={`${state.direction === "rtl" ? "left" : "right"}`}
    />
  );
  const setExpandedParent = (menu_list) => {
    menu_list.map((item) => {
      if (item.menu_url === pathname) {
        let temp = [...openKeys];
        temp.push(item.menu_id.toString());
        setOpenKeys(temp);
      }
      if (item.children.length > 0) {
        item.children.map((element) => {
          if (element.menu_url === pathname) {
            let temp = [...openKeys];
            temp.push(element.parent_menu_id.toString());
            setOpenKeys(temp);
          }
        });
      }
    });
  };
  useEffect(() => {
    const menu_list = JSON.parse(localStorage.getItem("menu_list"));
    setAppRoutes(menu_list);
    setExpandedParent(menu_list);
    if (appRoutes) {
      appRoutes.forEach((route, index) => {
        const isCurrentPath =
          pathname.indexOf(lowercase(route.menu_url)) > -1 ? true : false;
        const key = route.menu_url;
        rootSubMenuKeys.push(key);
        if (isCurrentPath) {
          setOpenKeys([...openKeys, key]);
        }
        // if (route.children.length > 0) {
        //   console.log('here i am children!')
        //   route.children.map((item) => {
        //     if (pathname === item.menu_url) {
        //       const parentMenuId = item.parent_menu_id.toString();
        //       setOpenKeys([...openKeys, parentMenuId]);
        //     }
        //   })
        // }
      });
    }
  }, []);

  // useEffect(()=>{

  // }, [])

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.slice(-1);
    if (rootSubMenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys([...latestOpenKey]);
    } else {
      setOpenKeys(latestOpenKey ? [...latestOpenKey] : []);
    }
  };
  const buildSubmenu = (data, index) => {
    if (data.children.length <= 0) {
      return (
        <Menu.Item
          key={data.menu_id}
          className={data.menu_url == pathname ? "menu-active" : ""}
          style={{
            background: "linear-gradient(to left, #003578 , #0078D4)",
          }}
        >
          <Link href={data.menu_url}>
            <a>
              <i className={`${data.menu_icon_class} mr-1`}></i>
              <span className="mr-auto" style={{ fontSize: "16px" }}>
                {capitalize(data.menu_name)}
              </span>
            </a>
          </Link>
        </Menu.Item>
      );
    } else {
      return (
        <SubMenu
          key={data.menu_id}
          icon={<i className={`${data.menu_icon_class} mr-1`}></i>}
          title={data.menu_name}
          className={data.menu_url == pathname ? "menu-active" : ""}
          style={{
            fontSize: "16px",
            background: "linear-gradient(to left, #004578 , #0078D4)",
          }}
        >
          {data.children.map((route, index) => {
            return buildSubmenu(route, index);
          })}
        </SubMenu>
      );
    }
  };

  const menu = appRoutes ? (
    <>
      {/* <Menu
        theme={sidebarTheme}
        className="border-0 scroll-y sidebar"
        style={{ flex: 1, height: "100%" }}
        mode={sidebarMode}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {appRoutes.map((route, index) => {
          return buildSubmenu(route, index);
        })}
      </Menu> */}

      <Menu
        inlineIndent={10}
        theme={sidebarTheme}
        className="border-0 scroll-y sidebar"
        style={{
          flex: 1,
          height: "100%",
          background: "linear-gradient(to left, #004578 , #0078D4)",
        }}
        mode={sidebarMode ?? "inline"}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {appRoutes.map((route, index) => {
          return buildSubmenu(route, index);
        })}
      </Menu>

      <Divider
        className={`m-0`}
        style={{
          display: `${sidebarTheme === "dark" ? "none" : ""}`,
        }}
      />
      {/* <div className={`py-3 px-4 bg-${sidebarTheme}`}>
        <Row type="flex" align="middle" justify="space-around">
          <Dropdown overlay={UserMenu}>
            <span>
              <Badge
                count={6}
                overflowCount={5}
                style={{
                  color: "rgb(245, 106, 0)",
                  backgroundColor: "rgb(253, 227, 207)",
                }}
              >
                <Avatar shape="circle" size={40} src="/images/avatar.jpg" />
              </Badge>
            </span>
          </Dropdown>
          {!collapsed && (
            <>
              <span className="mr-auto" />
              <Link href="//one-readme.fusepx.com">
                <a
                  className={`px-3 ${
                    sidebarTheme === "dark" ? "text-white" : "text-body"
                  }`}
                >
                  <Tooltip title="Help">
                    <FolderTwoTone style={{ fontSize: "20px" }} />
                  </Tooltip>
                </a>
              </Link>

              <Popconfirm
                placement="top"
                title="Are you sure you want to sign out?"
                onConfirm={() => router.push("/signin")}
                okText="Yes"
                cancelText="Cancel"
              >
                <a
                  className={`px-3 ${
                    sidebarTheme === "dark" ? "text-white" : "text-body"
                  }`}
                >
                  <PushpinTwoTone style={{ fontSize: "16px" }} />
                </a>
              </Popconfirm>
            </>
          )}
        </Row>
      </div> */}
    </>
  ) : (
    <></>
  );
  return (
    <>
      <Inner>
        {!state.mobile && (
          <Sider
            width={300}
            className={`bg-${sidebarTheme}`}
            theme={sidebarTheme}
            collapsed={collapsed}
            style={{
              backgroundColor: "linear-gradient(to right, #4880EC, #019CAD)",
              fontSize: "16px",
            }}
          >
            {menu}
          </Sider>
        )}

        {state.mobile && (
          <Drawer
            closable={false}
            width={220}
            placement={`${state.direction === "rtl" ? "right" : "left"}`}
            onClose={() => dispatch({ type: "mobileDrawer" })}
            visible={state.mobileDrawer}
            className="chat-drawer"
          >
            <Inner>
              <div
                style={{
                  overflow: `hidden`,
                  flex: `1 1 auto`,
                  flexDirection: `column`,
                  display: `flex`,
                  height: `100vh`,
                  maxHeight: `-webkit-fill-available`,
                }}
              >
                <DashHeader>
                  <Header>
                    <Link href="/">
                      <a className="brand mx-3">
                        <PlaySquareTwoTone style={{ fontSize: "20px" }} />
                        <strong className="text-black pl-2">
                          {state.name}
                        </strong>
                      </a>
                    </Link>
                  </Header>
                </DashHeader>
                {menu}
              </div>
            </Inner>
          </Drawer>
        )}

        <Drawer
          title="Settings2"
          placement={`${state.direction === "rtl" ? "left" : "right"}`}
          closable={true}
          width={300}
          onClose={() => dispatch({ type: "options" })}
          visible={state.optionDrawer}
        >
          <List.Item
            actions={[
              <Switch
                size="small"
                checked={!!state.boxed}
                onChange={(checked) => dispatch({ type: "boxed" })}
                key={1}
              />,
            ]}
          >
            <span
              css={`
                -webkit-box-flex: 1;
                -webkit-flex: 1 0;
                -ms-flex: 1 0;
                flex: 1 0;
              `}
            >
              Boxed view
            </span>
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key={2}
                size="small"
                checked={!!state.darkSidebar}
                disabled={state.weakColor}
                onChange={(checked) => dispatch({ type: "sidebarTheme" })}
              />,
            ]}
          >
            <span
              css={`
                -webkit-box-flex: 1;
                -webkit-flex: 1 0;
                -ms-flex: 1 0;
                flex: 1 0;
              `}
            >
              Dark sidebar menu
            </span>
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key={3}
                size="small"
                checked={!!state.sidebarPopup}
                disabled={state.collapsed}
                onChange={(checked) => dispatch({ type: "sidebarPopup" })}
              />,
            ]}
          >
            <span
              css={`
                -webkit-box-flex: 1;
                -webkit-flex: 1 0;
                -ms-flex: 1 0;
                flex: 1 0;
              `}
            >
              Popup sub menus
            </span>
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key={4}
                size="small"
                checked={!!state.sidebarIcons}
                disabled={state.collapsed}
                onChange={(checked) => dispatch({ type: "sidebarIcons" })}
              />,
            ]}
          >
            <span
              css={`
                -webkit-box-flex: 1;
                -webkit-flex: 1 0;
                -ms-flex: 1 0;
                flex: 1 0;
              `}
            >
              Sidebar menu icons
            </span>
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key={5}
                size="small"
                checked={!!state.collapsed}
                onChange={(checked) => dispatch({ type: "collapse" })}
              />,
            ]}
          >
            <span
              css={`
                -webkit-box-flex: 1;
                -webkit-flex: 1 0;
                -ms-flex: 1 0;
                flex: 1 0;
              `}
            >
              Collapsed sidebar menu
            </span>
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key={6}
                size="small"
                checked={!!state.weakColor}
                onChange={(checked) =>
                  dispatch({ type: "weak", value: checked })
                }
              />,
            ]}
          >
            <span
              css={`
                -webkit-box-flex: 1;
                -webkit-flex: 1 0;
                -ms-flex: 1 0;
                flex: 1 0;
              `}
            >
              Weak colors
            </span>
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key={7}
                size="small"
                checked={!!state.direction === "rtl"}
                onChange={(checked) =>
                  dispatch({ type: "direction", value: checked })
                }
              />,
            ]}
          >
            <span
              css={`
                -webkit-box-flex: 1;
                -webkit-flex: 1 0;
                -ms-flex: 1 0;
                flex: 1 0;
              `}
            >
              RTL/LTR Toggle
            </span>
          </List.Item>
        </Drawer>
      </Inner>
    </>
  );
};

export default withRouter(SidebarContent);
