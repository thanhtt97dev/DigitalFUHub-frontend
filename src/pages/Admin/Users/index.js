import React, { useCallback, useEffect, useState } from 'react';
import { Button, Select, Form, Input, Table, Tag, Spin } from 'antd';

import { getUsersByCondition } from '~/api/user';
import { getAllRoles } from '~/api/role';
import { Link } from 'react-router-dom';

const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '40%',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        width: '20%',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => <Tag color={status ? 'green' : 'volcano'}>{status ? 'Activate' : 'Ban'}</Tag>,
        width: '20%',
    },
    {
        title: '',
        dataIndex: 'id',
        key: 'x',
        render: (id, record) => (
            <Link to={`${id}`} hidden={record.role === 'Admin'}>
                <Button type="primary">Detail</Button>
            </Link>
        ),
    },
];

function Users() {
    const [loading, setLoading] = useState(true);
    const [dataTable, setDataTable] = useState([]);
    const [roles, setRoles] = useState([]);

    const onFinish = useCallback((values) => {
        setLoading(true);
        const dataRequest = {
            email: values.email,
            roleId: values.role,
            status: values.status,
        };

        getUsersByCondition(dataRequest)
            .then((res) => {
                let respone = [];
                res.data.forEach((data) => {
                    respone.push({
                        key: data.userId,
                        id: data.userId,
                        email: data.email,
                        role: data.roleName,
                        status: data.status,
                    });
                });
                setDataTable(respone);
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
            .catch((err) => {
                console.log('faild');
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        getUsersByCondition()
            .then((res) => {
                let respone = [];
                res.data.forEach((data) => {
                    respone.push({
                        key: data.userId,
                        id: data.userId,
                        email: data.email,
                        role: data.roleName,
                        status: data.status,
                    });
                });
                setDataTable(respone);
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
            .catch((err) => {
                console.log('faild');
            });

        getAllRoles()
            .then((res) => {
                setRoles(res.data);
            })
            .catch((err) => {
                console.log('faild');
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Spin tip="Loading..." spinning={loading}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 0,
                    }}
                    style={{
                        maxWidth: 500,
                        position: 'relative',
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ email: '', role: 0, status: -1 }}
                >
                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Role" name="role">
                        <Select>
                            <Select.Option value={0}>All</Select.Option>
                            {roles.map((role, index) => {
                                return (
                                    <Select.Option key={index} value={role.roleId}>
                                        {role.roleName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Status" name="status">
                        <Select>
                            <Select.Option value={-1}>All</Select.Option>
                            <Select.Option value={1}>Active</Select.Option>
                            <Select.Option value={0}>Ban</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ position: 'absolute', top: 111, left: 550 }}>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                    </Form.Item>
                </Form>

                <Table columns={columns} pagination={{ size: 10 }} dataSource={dataTable} />
            </Spin>
        </>
    );
}

export default Users;
