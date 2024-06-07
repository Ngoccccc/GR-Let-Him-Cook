import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import apiURL from "../../../instances/axiosConfig";
import { Row, Col, Card, Table, Button, Input, Modal } from "antd";
import removeVietnameseTones from "./../../../utils/removeVietnameseTones";
function UserManager() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "35%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "15%",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <Button
          className="btn btn-danger"
          onClick={() => handleDeleteUser(record)}
        >
          Xóa tài khoản
        </Button>
      ),
    },
  ];

  useLayoutEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${apiURL}/api/v1/user/users`);
      setUsers(res.data);
      setFilteredUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (user) => {
    try {
      await Modal.confirm({
        title: "Xác nhận xóa",
        content: `Bạn có chắc chắn muốn xóa tài khoản "${user.name}"?`,
        onOk: async () => {
          await axios.delete(`${apiURL}/api/v1/user/delete-user/${user._id}`);
          setUsers(users.filter((i) => i._id !== user._id));
          setFilteredUsers(users.filter((i) => i._id !== user._id));
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const value = removeVietnameseTones(e.target.value.toLowerCase());
    setSearchText(value);

    const filteredData = users.filter(
      (user) =>
        removeVietnameseTones(user.name.toLowerCase()).includes(value) ||
        removeVietnameseTones(user.email.toLowerCase()).includes(value) ||
        removeVietnameseTones(user.role.toLowerCase()).includes(value)
    );

    setFilteredUsers(filteredData);
  };

  return (
    <div>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Danh sách người dùng"
          >
            <Input
              placeholder="Tìm kiếm người dùng"
              value={searchText}
              onChange={handleSearch}
              style={{ marginBottom: "1rem" }}
            />
            <Table
              pagination={{
                pageSize: 5,
              }}
              columns={columns}
              dataSource={filteredUsers}
              className="ant-border-space"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UserManager;
