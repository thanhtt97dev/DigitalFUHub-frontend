import React, { useEffect, useState, useContext } from "react";
import validator from 'validator';
import classNames from 'classnames/bind';
import styles from './Personal.module.scss';
import Spinning from "~/components/Spinning";
import fptImage from '~/assets/images/user.jpg';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { getUserById, editFullNameUser, editAvatarUser } from "~/api/user";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { Col, Row, Form, Input, Button, Upload, Card, Avatar, Space } from 'antd';

///
const cx = classNames.bind(styles);
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
let fullNameDefault = '';
///

/// styles
const styleCard = { width: '100%' }
///

function Personal() {

    /// states
    const navigate = useNavigate();
    const [isEditFullName, setIsEditFullName] = useState(false);
    const [isLoadingSpinning, setIsLoadingSpinning] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [imgPreview, setImgPreview] = useState('');
    const [reloadUserInfoFlag, setReloadUserInfoFlag] = useState(false);
    const [isloadingButtonSaveInfo, setIsloadingButtonSaveInfo] = useState(false);
    const [isloadingButtonSaveAvatar, setIsloadingButtonSaveAvatar] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [formUserInfo] = Form.useForm();
    const [formUserAvatar] = Form.useForm();
    ///

    /// contexts
    const notification = useContext(NotificationContext)
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// useEffects
    useEffect(() => {
        if (user === undefined || user === null) {
            return navigate('/login');
        }

        setIsLoadingSpinning(true);

        getUserById(user.id)
            .then((res) => {
                if (res.status === 200) {
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

                    formUserInfo.setFieldValue("fullName", res.data.fullname);
                    fullNameDefault = res.data.fullname;
                    setIsLoadingSpinning(false);
                }
            })
            .catch((error) => {
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, reloadUserInfoFlag]);
    ///

    /// handles
    const reloadUserInfo = () => {
        setReloadUserInfoFlag(!reloadUserInfoFlag);
    }

    const onFinishFormInfo = (value) => {
        // debugger
        setIsloadingButtonSaveInfo(true);

        const { fullName } = value;
        if (user === null || user === undefined) return navigate('/login');

        // data request dto
        const dataRequest = {
            userId: user.id,
            fullName: fullName
        }

        editFullNameUser(dataRequest)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        reloadUserInfo();
                        notification("success", "Chỉnh sửa thông tin thành công");
                        setIsloadingButtonSaveInfo(false);
                        setIsEditFullName(false);
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });

    };

    const fullNameValidator = (value) => {
        let newFullName = formUserInfo.getFieldValue(value.field);

        if (newFullName === undefined || newFullName === "") {
            return Promise.reject("Họ và tên không được bỏ trống");
        }
        // else if (!validator.isAlpha(newFullName, 'vi-VN', { ignore: ' ' })) {
        //     return Promise.reject("Họ và tên chỉ chứa các kí tự chữ cái");
        // } 
        else {
            return Promise.resolve()

        }
    }

    const onFinishFormAvatar = (values) => {
        setIsloadingButtonSaveAvatar(true);

        if (user === null || user === undefined) return navigate('/login');

        const { fileUpload } = values;

        // data request dto
        const dataRequest = {
            userId: user.id,
            avatar: fileUpload ? fileUpload.fileList[0].originFileObj : null
        }

        editAvatarUser(dataRequest)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        reloadUserInfo();
                        notification("success", "Chỉnh sửa ảnh đại diện thành công");

                        formUserAvatar.resetFields();
                        setFileList([]);
                        setIsloadingButtonSaveAvatar(false);
                    }
                }
            })
            .catch(error => { });

    };

    const handlePreview = async (file) => {
        const imgBase64 = await getBase64(file.originFileObj);
        setImgPreview(imgBase64);
    };

    const handleChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        setFileList(newFileList);
        handlePreview(newFileList[0]);
    };

    const handleClickEditFullName = () => {
        setIsEditFullName(!isEditFullName);
    }

    const handleClickCancel = () => {
        formUserInfo.resetFields();
        setUserInfo({
            ...userInfo,
            fullname: fullNameDefault
        });
        formUserInfo.setFieldValue("fullName", fullNameDefault);

        setIsEditFullName(false);
    }
    ///

    return (
        <Spinning spinning={isLoadingSpinning}>
            <Card title="Thông tin cá nhân" style={styleCard} type="inner">
                <Row>
                    <Col span={15} offset={1} style={{ borderRight: '1px solid #e8e8e8' }}>
                        <Form
                            labelCol={{
                                flex: '110px',
                            }}
                            name="control-hooks"
                            form={formUserInfo}
                            onFinish={onFinishFormInfo}
                            labelWrap >
                            <Form.Item name='fullName' label="Họ và tên" labelAlign="left" style={{ width: '100%' }}
                                rules={[
                                    {
                                        validator: fullNameValidator
                                    }
                                ]}
                            >
                                <Row gutter={8}>
                                    <Col span={17}>
                                        <Space align="center" size={10}>
                                            <Input disabled={!isEditFullName} value={userInfo.fullname} style={{ width: 280 }} onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })} />

                                            {
                                                isEditFullName ?
                                                    (<Space align="center">
                                                        <Button danger ghost loading={isloadingButtonSaveInfo} htmlType="submit">Lưu</Button>
                                                        <Button onClick={handleClickCancel}>Hủy</Button>
                                                    </Space>)
                                                    : (<Button icon={<EditOutlined />} onClick={handleClickEditFullName}>Chỉnh sửa</Button>)
                                            }
                                        </Space>
                                        <p style={{ color: 'gray', marginTop: 10 }}>
                                            Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các đánh giá của bạn.
                                        </p>
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
                        </Form>
                    </Col >


                    <Col span={8}>
                        <Form
                            onFinish={onFinishFormAvatar}
                            form={formUserAvatar}
                        >
                            <div className={cx('container-image')}>
                                {imgPreview ?
                                    <Avatar size={100} src={imgPreview} />
                                    :
                                    userInfo ? <Avatar size={100} src={userInfo.avatar ? userInfo.avatar : fptImage} /> : <Avatar size={100} icon={<UserOutlined />} />

                                }

                                <Form.Item name='fileUpload' required style={{ width: '100%', textAlign: 'center' }}>
                                    <Upload showUploadList={false} maxCount={1} fileList={fileList} onChange={handleChange}
                                        accept=".png, .jpeg, .jpg"
                                    >
                                        <Button icon={<UploadOutlined />}>Tải lên</Button>
                                        <div style={{ textAlign: 'center' }}> (PNG, JPG hoặc JPEG)</div>
                                    </Upload>
                                </Form.Item>
                            </div>
                            {
                                fileList.length > 0 ? (
                                    <Row className={cx('flex-item-center')}>
                                        <Col>
                                            <Button type="primary" htmlType="submit" loading={isloadingButtonSaveAvatar}>Lưu ảnh đại diện</Button>
                                        </Col>
                                    </Row>
                                ) : <></>
                            }

                        </Form>
                    </Col>
                </Row >
            </Card >
        </Spinning>
    );
}

export default Personal;
