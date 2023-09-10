import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Col, Row, Form, Input, Radio, Select, Button, Popconfirm, notification } from 'antd';
import { WarningOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
//import { Spin } from 'antd';

import { getUserById, editUserInfo } from '~/api/user';
import { getAllRoles } from '~/api/role';
import logoFPT from "~/assets/images/fpt-logo.jpg"

function Detail() {
    let { id } = useParams();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({ userId: '', email: '', roleId: 0, status: 0 });
    const [roles, setRoles] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    useLayoutEffect(() => {
        getUserById(id)
            .then((res) => {
                if (res.data.roleId === 1) navigate('/admin/users');
                setUserInfo({
                    userId: res.data.userId,
                    email: res.data.email,
                    roleId: res.data.roleId,
                    status: res.data.status,
                });
                Form.setFieldsValue({
                    userId: res.data.userId,
                });
            })
            .catch(() => { });

        getAllRoles()
            .then((res) => {
                setRoles(res.data.filter((x) => x.roleId === 2));
            })
            .catch((err) => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const initFormValues = [
        {
            name: 'userId',
            value: userInfo.userId,
        },
        {
            name: 'email',
            value: userInfo.email,
        },
        {
            name: 'role',
            value: userInfo.roleId,
        },
        {
            name: 'status',
            value: userInfo.status ? 1 : 0,
        },
    ];

    // confirm save
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showPopconfirm = (values) => {
        setUserInfo({ userId: values.userId, email: values.email, roleId: values.role, status: values.status });
        setOpenConfirm(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        editUserInfo(id, userInfo)
            .then((res) => {
            })
            .catch((err) => { });
        setTimeout(() => {
            openNotification();
            setOpenConfirm(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        setOpenConfirm(false);
    };

    const openNotification = () => {
        api.open({
            message: 'Alter',
            description: "Update user's info success!",
            duration: 3,
        });
    };

    return (
        <>
            {contextHolder}
            <Row gutter={32}>
                <Col offset={4} span={4}>
                    <Image
                        width={200}
                        src={logoFPT}
                    />
                </Col>
                <Col offset={1} span={14}>
                    <Form
                        layout="horizontal"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                        fields={initFormValues}
                        onFinish={showPopconfirm}
                    >
                        <Form.Item name="userId" label="User Id">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="role" label="Role">
                            <Select>
                                {roles.map((role, index) => {
                                    return (
                                        <Select.Option key={index} value={role.roleId} checked>
                                            {role.roleName}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label="Status">
                            <Radio.Group>
                                <Radio value={1}>Active</Radio>
                                <Radio value={0}>Ban</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 10 }}>
                            <Popconfirm
                                icon={<WarningOutlined />}
                                placement="rightTop"
                                title="Alter"
                                description="Are you sure to change?"
                                open={openConfirm}
                                okButtonProps={{ loading: confirmLoading }}
                                onConfirm={handleOk}
                                onCancel={handleCancel}
                            >
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Popconfirm>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col offset={20}>
                    <Button size={'large'} onClick={() => navigate(-1)}>
                        <RollbackOutlined />
                        Back
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default Detail;
