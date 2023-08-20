import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Col, Row, Form, Input, Radio, Select, Button, Popconfirm } from 'antd';
import { WarningOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
//import { Spin } from 'antd';

import { getUserById, editUserInfo } from '~/api/user';
import { getAllRoles } from '~/api/role';

function Detail() {
    let { id } = useParams();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({ userId: '', email: '', roleId: 0, status: 0 });
    const [roles, setRoles] = useState([]);
    //const [loading, setLoading] = useState(true);

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
            .catch(() => {});

        getAllRoles()
            .then((res) => {
                setRoles(res.data.filter((x) => x.roleId === 2));
            })
            .catch((err) => {
                console.log('faild');
            });
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
                console.log('sucess');
            })
            .catch((err) => {
                console.log('err');
            });
        setTimeout(() => {
            setOpenConfirm(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        setOpenConfirm(false);
    };

    return (
        <>
            <Row gutter={32}>
                <Col offset={4} span={4}>
                    <Image
                        width={200}
                        src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/328544549_494001532902586_198214383855259790_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=XDThcNWOIx8AX_RGnPl&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfDn05NvPEGdwYjHXWpdEv-6tkJMLzrJp_bnuQKreHsCTg&oe=64E753F6"
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
                    <Button size={'large'} onClick={() => navigate('/admin/users')}>
                        <RollbackOutlined />
                        Back
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default Detail;
