import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logo.png";
import "../../../styles/AdminStyle.css";

const MainSider = () => {
  return (
    <div className="main-sider">
      <div className="logo">
        <img src={logo} alt="logo" />
        <h1>Chef</h1>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          Users
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          Videos
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          Uploads
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default MainSider;
