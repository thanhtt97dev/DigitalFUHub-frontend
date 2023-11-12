import React, { useState, useEffect, useContext } from "react";
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { Modal, List, Space, Input, Button, Form } from 'antd';
import { NotificationContext } from '~/context/UI/NotificationContext';
import { getAllReasonReportProducts, addReportProduct } from '~/api/reportProduct';

///
const cx = classNames.bind(styles);
const { TextArea } = Input;
require('moment/locale/vi');
///

/// styles
const styleListReasons = { maxHeight: '200px', overflow: 'auto' }
const styleBackIcon = { width: 24, height: 24, cursor: 'pointer' }
///

const ReportProduct = ({ isOpenReasons, setIsOpenReasons, productId }) => {

    /// states
    const navigate = useNavigate();
    const [reasons, setReasons] = useState([]);
    const [reasonSelected, setReasonSelected] = useState(null);
    const [isLoadingReasons, setIsLoadingReasons] = useState(true);
    const [isLoadingButtonSendReport, setIsLoadingButtonSendReport] = useState(false);
    const [form] = Form.useForm();
    ///

    /// contexts
    const notification = useContext(NotificationContext)
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// handles
    const closeReportProduct = () => {
        setIsOpenReasons(false);
    }

    const handleSelectedReason = (reason) => {
        setReasonSelected(reason);
    }

    const handleBackToListReasons = () => {
        setReasonSelected(null);
    }

    const loadingButtonSendReport = () => {
        setIsLoadingButtonSendReport(true);
    }

    const unLoadingButtonSendReport = () => {
        setIsLoadingButtonSendReport(false);
    }

    const onFinishDescription = (values) => {
        loadingButtonSendReport();

        if (user === null || user === undefined) return navigate('/login');

        const { description } = values;

        // declare form data
        var bodyFormData = new FormData();

        bodyFormData.append('UserId', user.id);
        bodyFormData.append('ProductId', productId);
        bodyFormData.append('ReasonReportProductId', reasonSelected.reasonReportProductId);
        if (description) bodyFormData.append('Description', description);

        // add report
        addReportProduct(bodyFormData)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        unLoadingButtonSendReport();
                        closeReportProduct();
                        notification("success", "Tố cáo thành công");
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                notification("error", "Có lỗi xảy ra, vui lòng thử lại!");
            })

    }
    ///

    /// useEffects
    useEffect(() => {
        getAllReasonReportProducts()
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setReasons(result);

                        // un loading
                        setIsLoadingReasons(false);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    useEffect(() => {
        setReasonSelected(null);
        form.resetFields();
    }, [isOpenReasons, form]);

    useEffect(() => {
        form.resetFields();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reasonSelected]);
    ///

    /// functions
    const validateDescription = (rule, value) => {
        const trimmedValue = value.replace(/\s+/g, ' ');

        if (trimmedValue.length < 10 || trimmedValue.length > 50) {
            return Promise.reject('Mô tả tố cáo phải có từ 10-50 ký tự');
        }
        return Promise.resolve();
    };

    ///

    return (
        <Spinning spinning={isLoadingReasons}>
            <Modal
                open={isOpenReasons}
                onCancel={closeReportProduct}
                title={reasonSelected ? <Space align="center">
                    <svg onClick={handleBackToListReasons} style={styleBackIcon} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m4.31 11.25 7.22-7.22-1.06-1.06-8.495 8.494a.748.748 0 0 0 0 1.072l8.495 8.494 1.06-1.06-7.22-7.22H22.5v-1.5H4.31Z" fill="#000"></path>
                    </svg> <p className={cx('text-ellipsis')}>{reasonSelected.viName}</p></Space> : 'Chọn lý do'}
                footer={[]}
            >
                {
                    reasonSelected ?
                        (<Form
                            name="control-hooks"
                            form={form}
                            onFinish={onFinishDescription}
                        >
                            <Form.Item name='description' rules={[
                                { required: true, message: 'Vui lòng nhập mô tả tố cáo.' },
                                { validator: validateDescription }
                            ]}>
                                <TextArea rows={4} placeholder="Mô tả tố cáo (Vui lòng nhập từ 10-50 ký tự)" />
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'end' }}>
                                {reasonSelected ? <Button key="back" type="primary" htmlType="submit" loading={isLoadingButtonSendReport} ghost>Gửi tố cáo</Button> : <></>}
                            </Form.Item>
                        </Form>)
                        : (
                            <List
                                itemLayout="horizontal"
                                dataSource={reasons}
                                renderItem={(item) => (
                                    <List.Item className={cx('item-reason')} onClick={() => handleSelectedReason(item)}>
                                        {item.viName}
                                    </List.Item>
                                )}
                                style={styleListReasons}
                            />)

                }

            </Modal>
        </Spinning>)
}

export default ReportProduct;
