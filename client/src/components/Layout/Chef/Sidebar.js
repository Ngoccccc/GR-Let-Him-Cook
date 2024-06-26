import React, { useState, useLayoutEffect } from "react";
import { Flex, Menu } from "antd";
import { FaLeaf } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState("1");

  useLayoutEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/chef/posts")) {
      setSelected("1");
    } else if (path.startsWith("/chef/courses")) {
      setSelected("2");
    }
  }, [location.pathname]);

  const handleMenuItemClick = (key) => {
    setSelected(key);
    switch (key) {
      case "1":
        navigate("/chef/posts");
        break;
      case "2":
        navigate("/chef/courses");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <FaLeaf />
        </div>
      </Flex>

      <Menu
        mode="inline"
        selectedKeys={[selected]}
        className="menu-bar"
        onSelect={({ key }) => handleMenuItemClick(key)}
        items={[
          {
            key: "1",
            icon: <FaLeaf />,
            label: "Quản lý bài viết",
          },
          {
            key: "2",
            icon: <FaLeaf />,
            label: "Quản lý khóa học",
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
