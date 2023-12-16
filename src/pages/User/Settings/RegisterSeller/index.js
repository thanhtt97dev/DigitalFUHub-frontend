import { Card, Row, Col, Form, Input, Button, Upload, Avatar, Space, Modal, Checkbox } from "antd";
import { registerShop } from "~/api/shop";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Spinning from "~/components/Spinning";
import { useSignOut } from "react-auth-kit";
import { getUserId, removeDataAuthInCookies } from '~/utils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { checkExistShopName } from "~/api/shop";
import { RESPONSE_CODE_SUCCESS, UPLOAD_FILE_SIZE_LIMIT } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import debounce from "debounce-promise";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

const debounceCheckExistShopName = debounce((data) => {
    const res = checkExistShopName(data);
    return Promise.resolve({ res: res });
}, 500);

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
function RegisterSeller() {
    const notification = useContext(NotificationContext);
    const signOut = useSignOut()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [shopDescription, setShopDescription] = useState('');
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();
    const [openNotificationFileExceedLimit, setOpenNotificationFileExceedLimit] = useState(false);
    const [msgNotificationFileExceedLimit, setMsgNotificationFileExceedLimit] = useState([]);
    const [imgBase64, setImgBase64] = useState('');
    const [acceptPolicy, setAcceptPolicy] = useState(false)


    const handlePreview = async (file) => {
        const imgBase64 = await getBase64(file.originFileObj);
        setImgBase64(imgBase64);
    };
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

    const onFinish = (values) => {
        setLoading(true);
        var formData = new FormData();
        formData.append("userId", getUserId());
        formData.append("shopName", values.shopName);
        formData.append("shopDescription", shopDescription);
        formData.append("avatarFile", values.avatarFile.fileList[0].originFileObj);
        registerShop(formData)
            .then(res => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    notification('success', "Đăng ký thành công vui lòng đăng nhập lại.");
                    removeDataAuthInCookies();
                    signOut();
                    return navigate('/login');

                } else {
                    notification('error', "Vui lòng kiểm tra lại.");
                }
            })
            .catch(err => {
                setLoading(false);
                notification('error', "Đã có lỗi xảy ra vui lòng thử lại sau.");
            })
    }
    const handleCloseNotificationFileExceedLimit = () => {
        setMsgNotificationFileExceedLimit([]);
        setOpenNotificationFileExceedLimit(false);
    }

    const checkboxPolicyChange = (e) => {
        setAcceptPolicy(e.target.checked)
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
                title="Đăng ký người bán hàng"
                style={{
                    width: '100%',
                }}
                type="inner"
            >

                <Form
                    onFinish={onFinish}
                    form={form}
                >
                    <Row justify="center">
                        <Col span={5}>
                            <Space align="center" direction="vertical" >
                                {fileList.length > 0 ?
                                    <Avatar size={100} src={imgBase64} />
                                    :
                                    <Avatar size={100} icon={<UserOutlined />} />
                                }
                                <Form.Item name='avatarFile' required style={{ width: '100%', textAlign: 'center' }}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (fileList.length > 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Ảnh đại diện không để trống.'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Upload showUploadList={false} fileList={fileList} maxCount={1} onChange={handleChange}
                                        accept=".png, .jpeg, .jpg"
                                    >
                                        <Button icon={<UploadOutlined />}>Tải lên</Button>
                                        <div style={{ textAlign: 'center', marginTop: "5px" }}> Ảnh đại diện</div>
                                    </Upload>
                                </Form.Item>
                            </Space>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col span={14} style={{ borderRight: '1px solid rgb(232, 232, 232)' }}>
                            <Row>
                                <Col span={4}><div>Tên cửa hàng</div></Col>
                                <Col span={16}>
                                    <Form.Item name='shopName'
                                        rules={[
                                            () => ({
                                                validator(_, value) {
                                                    const data = value === undefined ? '' : value.trim();
                                                    if (data) {
                                                        return new Promise((resolve, reject) => {
                                                            debounceCheckExistShopName(data)
                                                                .then(({ res }) => {
                                                                    res.then(res => {
                                                                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                                                                            resolve();
                                                                        } else {
                                                                            reject(new Error('Tên cửa hàng không khả dụng.'));
                                                                        }
                                                                    }).catch(err => {
                                                                        reject(new Error('Tên cửa hàng không khả dụng.'));
                                                                    })
                                                                });
                                                        })
                                                    } else {
                                                        return Promise.reject(new Error('Tên cửa hàng không để trống.'));
                                                    }
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input />
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
                                <Col offset={4}>
                                    <Checkbox onChange={checkboxPolicyChange}>
                                        Tôi đồng ý với <Link to={"/salesPolicy"} target="_blank">chính sách và điều khoản dịch vụ</Link> của nền tảng
                                    </Checkbox>
                                </Col>

                            </Row>

                            <Row style={{ marginTop: "20px" }}>
                                <Col offset={11}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" disabled={acceptPolicy === false}>Đăng ký</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>

            </Card >
        </Spinning >)
}

export default RegisterSeller;