/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Row, Col, Form, Input, Button, Upload, Avatar, Space, Modal } from "antd";
import { editShop, getShopOfSeller } from "~/api/shop";
// import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Spinning from "~/components/Spinning";
import { getUserId } from '~/utils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RESPONSE_CODE_SHOP_BANNED, RESPONSE_CODE_SUCCESS, UPLOAD_FILE_SIZE_LIMIT } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
function EditShop() {
    const notification = useContext(NotificationContext);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [shop, setShop] = useState();
    const [shopDescription, setShopDescription] = useState('');
    const [fileList, setFileList] = useState([]);
    // const navigate = useNavigate()
    const [openNotificationFileExceedLimit, setOpenNotificationFileExceedLimit] = useState(false);
    const [msgNotificationFileExceedLimit, setMsgNotificationFileExceedLimit] = useState([]);
    const [imgPreview, setImgPreview] = useState('');
    const handlePreview = async (file) => {
        const imgBase64 = await getBase64(file.originFileObj);
        setImgPreview(imgBase64);
    };
    const [buttonLoading, setButtonLoading] = useState(false);
    const handleChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        const lsFileExist = newFileList.filter(v => v.size > UPLOAD_FILE_SIZE_LIMIT)
        if (lsFileExist.length > 0) {
            newFileList = newFileList.filter(v => v.size <= UPLOAD_FILE_SIZE_LIMIT);
            var msgFileExceedLimit = `"${lsFileExist[0].name}" không thể được tải lên.`;
            setMsgNotificationFileExceedLimit([msgFileExceedLimit])
            setOpenNotificationFileExceedLimit(true);
            return;
        }
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        setFileList(newFileList);
        handlePreview(newFileList[0]);

    };

    useEffect(() => {
        setLoading(true);
        getShopOfSeller()
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setShop(res.data.result);
                    setImgPreview(res.data.result.avatar)
                    setShopDescription(res.data.result.description)
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đang bị khóa.")
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => {
                notification("error", "Đã có lỗi xảy ra.")
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500);
            })
    }, []);

    const onFinish = (values) => {
        setButtonLoading(true);
        const data = {
            userId: getUserId(),
            shopDescription: shopDescription,
            avatarFile: values.avatarFile ? values.avatarFile.fileList[0].originFileObj : null
        }
        editShop(data)
            .then(res => {
                if (res.data.status.responseCode === "00") {
                    notification('success', "Cập nhật thông tin cửa hàng thành công.");
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đang bị khóa.")
                }
                else {
                    notification('error', "Vui lòng kiểm tra lại.");
                }
            })
            .catch(err => {
                notification('error', "Đã có lỗi xảy ra vui lòng thử lại sau.");
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setButtonLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }
    const handleCloseNotificationFileExceedLimit = () => {
        setMsgNotificationFileExceedLimit([]);
        setOpenNotificationFileExceedLimit(false);
    }
    return (
        <Spinning spinning={loading}>
            <Modal
                open={openNotificationFileExceedLimit}
                footer={null}
                onCancel={handleCloseNotificationFileExceedLimit}
                title="Lưu ý"
            >
                <div>
                    {msgNotificationFileExceedLimit.map((v, i) => <div key={i}>{v}</div>)}
                    <div>- Kích thước tập tin vượt quá 2.0 MB.</div>
                    <Row justify="end">
                        <Col>
                            <Button type="primary" danger onClick={handleCloseNotificationFileExceedLimit}>Xác nhận</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
            <Card
                title={<div>Chỉnh sửa thông tin cửa hàng <Link to={`/shop/${getUserId()}`} target="_blank"><Button>Xem cửa hàng của tôi</Button></Link></div>}
                style={{
                    width: '100%',
                    height: '100vh',
                }}
                type="inner"
            >
                {shop &&
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Row >
                            <Col span={24}>
                                <Space align="center" direction="vertical" style={{ width: '100%' }}>
                                    {imgPreview ?
                                        <Avatar size={100} src={imgPreview} />
                                        :
                                        <Avatar size={100} icon={<UserOutlined />} />
                                    }
                                    <Form.Item name='avatarFile' required style={{ width: '100%', textAlign: 'center' }}>
                                        <Upload showUploadList={false} fileList={fileList} maxCount={1} onChange={handleChange}
                                            accept=".png, .jpeg, .jpg"
                                        >
                                            <Button icon={<UploadOutlined />}>Tải lên</Button>
                                            <div style={{ textAlign: 'center' }}> (PNG, JPG hoặc JPEG)</div>
                                        </Upload>
                                    </Form.Item>
                                </Space>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={14}
                            // style={{ borderRight: '1px solid rgb(232, 232, 232)' }}
                            >
                                <Row>
                                    <Col span={4}><div>Tên cửa hàng</div></Col>
                                    <Col span={16}>
                                        <Form.Item name='shopName' initialValue={shop.shopName}>
                                            <Input disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} ><div>Mô tả</div></Col>
                                    <Col span={16}>
                                        <Form.Item name='shopDescription' required
                                            rules={[
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (shopDescription.trim()) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Mô tả cửa hàng không để trống.'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={shopDescription}
                                                config={{
                                                    toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'undo', 'redo',]
                                                }}
                                                onReady={editor => {
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setShopDescription(data);
                                                }}
                                                onBlur={(event, editor) => {
                                                }}
                                                onFocus={(event, editor) => {
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </Col>
                            {/* <Col span={4} offset={2} >
                            
                        </Col> */}
                        </Row>
                        <Row justify="center">
                            <Col>
                                <Button loading={buttonLoading} type="primary" htmlType="submit">Xác nhận</Button>
                            </Col>
                        </Row>
                    </Form>
                }
            </Card>
        </Spinning>)
}

export default EditShop;