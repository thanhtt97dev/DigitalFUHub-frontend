import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Image, Divider, Col, Row, Form, Input, Button, Upload, notification, Card, Avatar } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';

import { getUserById, editUserInfo } from "~/api/user";
import { getUserId } from '~/utils';
import classNames from 'classnames/bind';
import styles from './Personal.module.scss';
// import { uploadFile } from '~/api/storage';

const cx = classNames.bind(styles)

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

function Personal() {

    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const userId = getUserId();
    const [userInfo, setUserInfo] = useState({});

    const [isEditingFullName, setIsEditingFullName] = useState(false);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);

    //const [form] = Form.useForm();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: type === 'success' ? 'Lưu thành công!' : 'Xảy ra lỗi trong quá trình lưu!',
            description: '',
        });
    };

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    useEffect(() => {
        if (userId === null) {
            alert("Some err!");
            return navigate("/login");
        }
        getUserById(userId)
            .then((res) => {
                setUserInfo({
                    userId: res.data.userId,
                    username: res.data.username,
                    email: res.data.email,
                    avatar: res.data.avatar,
                    fullname: res.data.fullname,
                    roleName: res.data.roleName,
                    roleId: res.data.roleId,
                    twoFactorAuthentication: res.data.twoFactorAuthentication,
                    status: res.data.status ? 1 : 0,
                });
            })
            .catch(() => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    const handleEditFullName = () => {
        setIsEditingFullName(true);
    };

    const handleEditAvatar = () => {
        setIsEditingAvatar(true);
    };

    const handleSaveFullName = () => {
        editUserInfo(userInfo.userId, userInfo)
            .then((res) => { openNotificationWithIcon('success') })
            .catch((err) => { openNotificationWithIcon('error') });
        setIsEditingFullName(false);
    };

    const handleCancelEditingFullName = () => {
        setIsEditingFullName(false);
    };

    const handleCancelEditingAvatar = () => {
        setIsEditingAvatar(false);
    };

    // const onFinish = (values) => {
    //     var bodyFormData = new FormData();
    //     bodyFormData.append('userId', 1);
    //     bodyFormData.append('fileUpload', values.upload[0].originFileObj);
    //     uploadFile('api/Files/Upload', bodyFormData)
    //         .then((res) => { openNotificationWithIcon('success') })
    //         .catch((err) => { openNotificationWithIcon('error') });
    //     setIsEditingAvatar(false);
    // };


    return (
        <>
            {contextHolder}


            <Card
                title="Thông tin cá nhân"
                style={{
                    width: '100%',
                }}
                type="inner"
            >

                <Row>
                    <Col span={15} offset={1} style={{ borderRight: '1px solid #e8e8e8' }}>
                        <Form
                            labelCol={{
                                flex: '110px',
                            }}
                            labelWrap

                        >
                            <Form.Item label="Họ và tên" labelAlign="left" style={{ width: '100%' }}>
                                <Row gutter={8}>
                                    <Col span={17}>
                                        {!isEditingFullName ? (
                                            <>
                                                <Input value={userInfo.fullname} disabled style={{ backgroundColor: "white", width: '100%' }} />
                                            </>
                                        ) : (
                                            <>
                                                <Input value={userInfo.fullname} style={{ width: '100%' }} onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })} />
                                            </>
                                        )}
                                        <p style={{ color: 'gray', marginTop: 10 }}>
                                            Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận của bạn.
                                        </p>

                                    </Col>
                                    <Col span={6}>
                                        {!isEditingFullName ? (
                                            <>
                                                <Button type="primary" onClick={handleEditFullName}>Chỉnh sửa</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button type="primary" onClick={handleSaveFullName} style={{ marginRight: '8px' }}>Lưu</Button>
                                                <Button onClick={handleCancelEditingFullName}>Hủy</Button>
                                            </>
                                        )}
                                    </Col>
                                </Row>

                            </Form.Item>

                            <Form.Item label="Tài khoản" labelAlign="left">
                                <Row gutter={8}>
                                    <Col span={17}>
                                        <Input value={userInfo.username} disabled style={{ backgroundColor: "white" }} />
                                    </Col>

                                </Row>

                            </Form.Item>

                            <Form.Item label="Email" labelAlign="left">
                                <Row gutter={8}>
                                    <Col span={17}>
                                        <Input value={userInfo.email} disabled style={{ backgroundColor: "white" }} />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form >
                    </Col >

                    <Col span={8}>
                        <div className={cx('container-image')}>
                            {!isEditingAvatar ? (
                                <Avatar size={100} src={userInfo.avatar} />
                            ) : (
                                <Form.Item name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload listType="picture-card" maxCount={1}>
                                        <div>
                                            <PlusOutlined />
                                            <div>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            )}


                            {!isEditingAvatar ? (
                                <>
                                    <Button type="primary" onClick={handleEditAvatar} style={{ marginTop: 10 }}>Chỉnh sửa</Button>
                                </>
                            ) : (
                                <>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>Lưu</Button>
                                        <Button onClick={handleCancelEditingAvatar}>Hủy</Button>
                                    </Form.Item>
                                </>
                            )}

                            {/* <Button type="primary" style={{ marginTop: 10 }}>Chỉnh sửa</Button> */}
                            <p style={{ color: 'gray', marginTop: 10 }}>JPG, PNG hoặc GIF</p>
                        </div>
                    </Col>
                </Row >
            </Card >




            {/* <div>
                <h2>Thông tin cá nhân</h2>
                <Divider />
            </div >
            <Row gutter={10}>
                <Col span={10}>
                    <h3>Họ và tên</h3><br />
                    {!isEditingFullName ? (
                        <>
                            <Input value={userInfo.fullname} disabled style={{ backgroundColor: "white" }} />
                        </>
                    ) : (
                        <>
                            <Input value={userInfo.fullname} onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })} />
                        </>
                    )}
                    <br /><br /><div>Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận của bạn.</div>
                </Col>
                <Col>
                    <div></div><br /><br />
                    {!isEditingFullName ? (
                        <>
                            <Button type="primary" onClick={handleEditFullName}>Chỉnh sửa</Button>
                        </>
                    ) : (
                        <>
                            <Button type="primary" onClick={handleSaveFullName} style={{ marginRight: '8px' }}>Lưu</Button>
                            <Button onClick={handleCancelEditingFullName}>Hủy</Button>
                        </>
                    )}
                </Col>
            </Row ><br />
            <Row gutter={10}>
                <Col span={10}>
                    <h3>Avatar</h3><br />
                    {!isEditingAvatar ? (
                        <>
                            <div>
                                <span style={{ marginRight: '20px' }}>
                                    Nên là ảnh vuông, chấp nhận các tệp: JPG, PNG hoặc GIF.
                                </span>
                                <Image width={100} height={100} src={userInfo.avatar} />
                            </div>

                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '20px' }}>
                                    Nên là ảnh vuông, chấp nhận các tệp: JPG, PNG hoặc GIF.
                                </span>
                                <div>
                                    <Form.Item name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
                                        <Upload listType="picture-card" maxCount={1}>
                                            <div>
                                                <PlusOutlined />
                                                <div>Upload</div>
                                            </div>
                                        </Upload>
                                    </Form.Item>
                                </div>
                            </div>
                        </>
                    )}
                </Col>
                <Col>
                    <div></div><br /><br />
                    {!isEditingAvatar ? (
                        <>
                            <Button type="primary" onClick={handleEditAvatar}>Chỉnh sửa</Button>
                        </>
                    ) : (
                        <>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>Lưu</Button>
                                <Button onClick={handleCancelEditingAvatar}>Hủy</Button>
                            </Form.Item>
                        </>
                    )}
                </Col>
            </Row ><br />
            <Row gutter={10}>
                <Col span={10}>
                    <br /><br /><h3>Tài khoản</h3><br />
                    <Input value={userInfo.username} disabled style={{ backgroundColor: "white" }} />
                </Col>
            </Row ><br />
            <Row gutter={10}>
                <Col span={10}>
                    <h3>Email</h3><br />
                    <Input value={userInfo.email} disabled style={{ backgroundColor: "white" }} />
                </Col>
            </Row ><br /> */}
        </>
    );
}

export default Personal;
