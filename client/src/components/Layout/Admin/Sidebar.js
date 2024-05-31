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
    if (path.startsWith("/admin/category")) {
      setSelected("1");
    } else if (path.startsWith("/admin/ingredients")) {
      setSelected("2");
    } else if (path.startsWith("/admin/posts")) {
      setSelected("3");
    } else if (path.startsWith("/admin/post-approval")) {
      setSelected("4");
    } else if (path.startsWith("/admin/course-approval")) {
      setSelected("5");
    } else if (path.startsWith("/admin/users")) {
      setSelected("6");
    }
  }, [location.pathname]);

  const handleMenuItemClick = (key) => {
    setSelected(key);
    switch (key) {
      case "1":
        navigate("/admin/category");
        break;
      case "2":
        navigate("/admin/ingredients");
        break;
      case "3":
        navigate("/admin/posts");
        break;
      case "4":
        navigate("/admin/post-approval");
        break;
      case "5":
        navigate("/admin/course-approval");
        break;
      case "6":
        navigate("/admin/users");
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
            label: "Quản lý danh mục",
          },
          {
            key: "2",
            icon: <FaLeaf />,
            label: "Quản lý nguyên liệu",
          },
          {
            key: "3",
            icon: <FaLeaf />,
            label: "Quản lý bài hướng dẫn",
          },
          {
            key: "4",
            icon: <FaLeaf />,
            label: "Phê duyệt bài hướng dẫn",
          },
          {
            key: "5",
            icon: <FaLeaf />,
            label: "Phê duyệt khóa học",
          },
          {
            key: "6",
            icon: <FaLeaf />,
            label: "Quản lý người dùng",
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
