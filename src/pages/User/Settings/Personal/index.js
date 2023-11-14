import React, { useEffect, useState, useContext } from "react";
import classNames from 'classnames/bind';
import styles from './Personal.module.scss';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { getUserById, editUserInfo } from "~/api/user";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { Col, Row, Form, Input, Button, Upload, Card, Avatar } from 'antd';

///
const cx = classNames.bind(styles);
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
///

/// styles
const styleCard = { width: '100%' }
///

function Personal() {

    /// states
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [imgPreview, setImgPreview] = useState('');
    const [reloadUserInfoFlag, setReloadUserInfoFlag] = useState(false);
    const [isloadingButtonSave, setIsloadingButtonSave] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
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
                }
            })
            .catch((error) => {
                console.log(error);
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, reloadUserInfoFlag]);
    ///

    /// handles
    const loadingButtonSave = () => {
        setIsloadingButtonSave(true);
    }

    const unLoadingButtonSave = () => {
        setIsloadingButtonSave(false);
    }

    const reloadUserInfo = () => {
        setReloadUserInfoFlag(!reloadUserInfoFlag);
    }

    const onFinish = (values) => {
        loadingButtonSave();

        if (user === null || user === undefined) return navigate('/login');

        const { fileUpload, fullName } = values;

        // data request dto
        const dataRequest = {
            userId: user.id,
            fullName: fullName,
            avatar: fileUpload ? fileUpload.fileList[0].originFileObj : null
        }

        editUserInfo(dataRequest)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        reloadUserInfo();
                        notification("success", "Chỉnh sửa thông tin thành công");

                        form.resetFields();
                        unLoadingButtonSave();
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });

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
    ///

    return (
        <>
            <Card title="Thông tin cá nhân" style={styleCard} type="inner">
                <Form
                    labelCol={{
                        flex: '110px',
                    }}
                    name="control-hooks"
                    form={form}
                    onFinish={onFinish}
                    labelWrap >
                    <Row>
                        <Col span={15} offset={1} style={{ borderRight: '1px solid #e8e8e8' }}>

                            <Form.Item name='fullName' label="Họ và tên" labelAlign="left" style={{ width: '100%' }}>
                                <Row gutter={8}>
                                    <Col span={17}>
                                        <Input value={userInfo.fullname} style={{ width: '100%' }} onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })} />
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
                            <Form.Item >
                                <Row>
                                    <Col offset={4}>
                                        <Button type="primary" htmlType="submit" loading={isloadingButtonSave}>Lưu</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col >


                        <Col span={8}>
                            <div className={cx('container-image')}>
                                {imgPreview ?
                                    <Avatar size={100} src={imgPreview} />
                                    :
                                    userInfo ? <Avatar size={100} src={userInfo.avatar} /> : <Avatar size={100} icon={<UserOutlined />} />

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
                        </Col>
                    </Row >
                </Form>
            </Card >
        </>
    );
}

export default Personal;
