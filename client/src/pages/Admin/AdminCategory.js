import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Space, Table, Button, Flex, Modal, Form, Input } from 'antd';

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '10%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: '60%',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: '30%',
            render: (text, record) => (
                <Flex justify="center" gap={10}>
                    <Button type="primary" onClick={() => handleEditCategory(record)}>
                        Sửa
                    </Button>
                    <Button className="btn btn-danger" onClick={() => handleDeleteCategory(record)}>
                        Xóa
                    </Button>
                </Flex>
            ),
        },
    ];

    React.useLayoutEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get('/api/v1/category/get-all-category');
            setCategories(res.data.categories);
        };
        fetchCategories();
    }, []);

    const handleCreateCategory = () => {
        setCurrentCategory(null);
        setIsModalVisible(true);
    };

    const handleEditCategory = (category) => {
        setCurrentCategory(category);
        form.setFieldsValue({ name: category.name });
        setIsModalVisible(true);
    };

    const handleDeleteCategory = async (category) => {
        try {
            await Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
                onOk: async () => {
                    await axios.delete(`/api/v1/category/delete-category/${category.categoryId}`);
                    setCategories(categories.filter((c) => c.categoryId !== category.categoryId));
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveCategory = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            console.log(currentCategory);
            if (currentCategory) {
                await axios.put(`/api/v1/category/update-category/${currentCategory.categoryId}`, values);
                setCategories(
                    categories.map((c) => (c.categoryId === currentCategory.categoryId ? { ...c, ...values } : c))
                );
            } else {
                const res = await axios.post('/api/v1/category/create-category', values);
                setCategories([...categories, res.data.category]);
            }
            setIsModalVisible(false);
            form.setFieldsValue({ name: "" });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        form.setFieldsValue({ name: "" });
        setIsModalVisible(false);
    };

    return (
        <div>
            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title="Danh sách danh mục"
                        extra={
                            <Space>
                                <Space>
                                    <Button type="primary" onClick={handleCreateCategory}>
                                        Thêm
                                    </Button>
                                </Space>
                            </Space>
                        }
                    >
                        <Table
                            pagination={{
                                pageSize: 5
                            }}
                            columns={columns}
                            dataSource={categories}
                            className="ant-border-space"
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={currentCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
                visible={isModalVisible}
                onOk={handleSaveCategory}
                onCancel={handleCancel}
                okText={currentCategory ? 'Lưu' : 'Thêm'}
            >
                <Form form={form} layout="vertical" initialValues={currentCategory}>
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AdminCategory;