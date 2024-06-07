import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Space,
  Table,
  Button,
  Flex,
  Modal,
  Form,
  Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import removeVietnameseTones from "../../utils/removeVietnameseTones";
import apiURL from "../../instances/axiosConfig";
function AdminIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      width: "45%",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: "15%",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "30%",
      render: (text, record) => (
        <Flex gap={10}>
          <Button type="primary" onClick={() => handleEditIngredient(record)}>
            Sửa
          </Button>
          <Button
            className="btn btn-danger"
            onClick={() => handleDeleteIngredient(record)}
          >
            Xóa
          </Button>
        </Flex>
      ),
    },
  ];

  useLayoutEffect(() => {
    const fetchIngredients = async () => {
      const res = await axios.get(`${apiURL}/api/v1/ingredient/get-ingredient`);
      setIngredients(res.data.ingredient);
    };
    fetchIngredients();
  }, []);

  const handleCreateIngredient = () => {
    setCurrentIngredient(null);
    setIsModalVisible(true);
  };

  const handleEditIngredient = (ingredient) => {
    setCurrentIngredient(ingredient);
    form.setFieldsValue({ name: ingredient.name, unit: ingredient.unit });
    setIsModalVisible(true);
  };

  const handleDeleteIngredient = async (ingredient) => {
    try {
      await Modal.confirm({
        title: "Xác nhận xóa",
        content: `Bạn có chắc chắn muốn xóa nguyên liệu "${ingredient.name}"?`,
        onOk: async () => {
          await axios.delete(
            `${apiURL}/api/v1/ingredient/delete-ingredient/${ingredient._id}`
          );
          setIngredients(ingredients.filter((i) => i._id !== ingredient._id));
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveIngredient = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      if (currentIngredient) {
        await axios.put(
          `${apiURL}/api/v1/ingredient/update-ingredient/${currentIngredient._id}`,
          values
        );
        setIngredients(
          ingredients.map((i) =>
            i._id === currentIngredient._id ? { ...i, ...values } : i
          )
        );
      } else {
        const res = await axios.post(
          `${apiURL}/api/v1/ingredient/create-ingredient`,
          values
        );
        setIngredients([...ingredients, res.data.ingredient]);
      }
      setIsModalVisible(false);
      form.setFieldsValue({ name: "", unit: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({ name: "", unit: "" });
    setIsModalVisible(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    removeVietnameseTones(ingredient.name.toLowerCase()).includes(
      removeVietnameseTones(searchQuery.toLowerCase())
    )
  );
  return (
    <div>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Danh sách nguyên liệu"
            extra={
              <Space>
                <Space>
                  <Input
                    placeholder="Tìm kiếm danh mục"
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <Button type="primary" onClick={handleCreateIngredient}>
                    Thêm nguyên liệu
                  </Button>
                </Space>
              </Space>
            }
          >
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={columns}
              dataSource={filteredIngredients}
              className="ant-border-space"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={currentIngredient ? "Sửa nguyên liệu" : "Thêm nguyên liệu"}
        visible={isModalVisible}
        onOk={handleSaveIngredient}
        onCancel={handleCancel}
        okText={currentIngredient ? "Lưu" : "Thêm"}
      >
        <Form form={form} layout="vertical" initialValues={currentIngredient}>
          <Form.Item
            label="Tên nguyên liệu"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên nguyên liệu!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đơn vị"
            name="unit"
            rules={[{ required: true, message: "Vui lòng nhập đơn vị!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminIngredients;
