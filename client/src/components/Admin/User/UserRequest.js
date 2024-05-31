import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Table, Button, Input, Modal, Flex } from "antd";
import removeVietnameseTones from "./../../../utils/removeVietnameseTones";

function UserRequest() {
  const [requests, setRequests] = useState([]);
  const [filteredRequest, setFilteredRequest] = useState([]);
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
      key: "userId.name",
      width: "20%",
      render: (text, record) => record.userId.name,
    },
    {
      title: "Email",
      key: "userId.email",
      width: "35%",
      render: (text, record) => record.userId.email,
    },
    {
      title: "Xem thông tin",
      key: "info",
      width: "25%",
      render: (text, record) => (
        <Button
          className="btn"
          style={{ backgroundColor: "blue", color: "white" }}
          onClick={() => handleShowInfo(record)}
        >
          Xem thông tin
        </Button>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <Flex gap={10}>
          <Button type="primary" onClick={() => handleApproveRequest(record)}>
            Phê duyệt
          </Button>
          <Button
            className="btn btn-danger"
            onClick={() => handleRejectRequest(record)}
          >
            Từ chối
          </Button>
        </Flex>
      ),
    },
  ];

  useLayoutEffect(() => {
    const fetchRequest = async () => {
      const res = await axios.get("/api/v1/user/get-all-request");
      setRequests(res.data.allRequest);
      setFilteredRequest(res.data.allRequest);
    };
    fetchRequest();
  }, []);

  const handleApproveRequest = async (request) => {
    try {
      await Modal.confirm({
        title: "Xác nhận phê duyệt",
        content: `Bạn có chắc chắn muốn phê duyệt tài khoàn "${request.userId.name}" lên làm đầu bếp?`,
        onOk: async () => {
          await axios.put(`/api/v1/user/approve-request/${request._id}`);
          setRequests(requests.filter((i) => i._id !== request._id));
          setFilteredRequest(
            filteredRequest.filter((i) => i._id !== request._id)
          );
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      await Modal.confirm({
        title: "Xác nhận từ chối",
        content: `Bạn có chắc chắn muốn từ chối tài khoàn "${request.userId.name}" lên làm đầu bếp?`,
        onOk: async () => {
          await axios.put(`/api/v1/user/reject-request/${request._id}`);
          setRequests(requests.filter((i) => i._id !== request._id));
          setFilteredRequest(
            filteredRequest.filter((i) => i._id !== request._id)
          );
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowInfo = async (info) => {
    try {
      await Modal.info({
        title: "Thông tin người dùng",
        content: (
          <div>
            <p>Số điện thoại: {info.phone}</p>
            <p>Lý do muốn lên đầu bếp: {info.roleRequestReason}</p>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const value = removeVietnameseTones(e.target.value.toLowerCase());
    setSearchText(value);

    const filteredData = requests.filter(
      (user) =>
        removeVietnameseTones(user.userId.name.toLowerCase()).includes(value) ||
        removeVietnameseTones(user.userId.email.toLowerCase()).includes(value)
    );

    setFilteredRequest(filteredData);
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
              dataSource={filteredRequest}
              rowKey={(record) => record._id}
              className="ant-border-space"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UserRequest;
