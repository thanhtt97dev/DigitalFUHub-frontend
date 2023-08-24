import React, { useEffect, useState } from 'react';
import { Button, Select, Form, Input, Table, Tag, Spin, Space } from 'antd';

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
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [dataTable, setDataTable] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchData, setSearchData] = useState({
        email: '',
        roleId: 0,
        status: -1,
    });

    const onFinish = (values) => {
        setLoading(true);

        setSearchData({
            email: values.email,
            roleId: values.role,
            status: values.status,
        });
    };

    const onFill = () => {
        form.setFieldsValue({ email: '', role: 0, status: -1 });
    };

    useEffect(() => {
        setLoading(true);

        setDataTable([]);

        getUsersByCondition(searchData)
            .then((res) => {
                let respone = [];
                res.data.forEach((data, index) => {
                    respone.push({
                        key: index,
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
                setLoading(false);
                alert('Unauthorized');
            });
    }, [searchData]);

    useEffect(() => {
        getAllRoles()
            .then((res) => {
                setRoles(res.data);
            })
            .catch((err) => {
                alert('Unauthorized');
            });
    }, []);

    const initFormValues = [
        {
            name: 'email',
            value: searchData.email,
        },
        {
            name: 'role',
            value: searchData.roleId,
        },
        {
            name: 'status',
            value: searchData.status,
        },
    ];

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
                    form={form}
                    onFinish={onFinish}
                    fields={initFormValues}
                >
                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Role" name="role">
                        <Select>
                            <Select.Option value={0}>All</Select.Option>
                            {roles.map((role) => {
                                return (
                                    <Select.Option key={role.roleId} value={role.roleId}>
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
                        <Space>
                            <Button htmlType="button" onClick={onFill}>
                                Reset
                            </Button>
                            <Button type="primary" htmlType="submit">
                                searchDatarch
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                <Table columns={columns} pagination={{ size: 10 }} dataSource={dataTable} />
            </Spin>
        </>
    );
}

export default Users;
