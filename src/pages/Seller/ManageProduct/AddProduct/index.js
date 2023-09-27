import React, { useEffect, useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, InputNumber, Spin, notification } from 'antd';

import UploadProductType, { UploadImagesProduct, UploadThumbnail, AddTagProduct, } from '~/components/Seller/Product/Add';
import { addProduct } from '~/api/seller';
import { getUserId } from '~/utils';
import { getAllCategory } from '~/api/category';
import Spinning from '~/components/Spinning';


function AddProduct() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const tagsProduct = useRef([]);
    const dataFiles = useRef([]);
    const btnAddItem = useRef();
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, description) => {
        api[type]({
            message: '',
            description: `${description}`
        });
    };
    useEffect(() => {
        getAllCategory()
            .then((res) => {
                if (res.data.status.responseCode === "00") {
                    setCategories(res.data.result)
                }
            })
            .catch((err) => {

            })
    }, [])
    const onFinish = (values) => {
        setLoading(true);
        let formData = new FormData();
        values.imagesProduct.fileList.forEach((file, index) => {
            formData.append(`images`, file.originFileObj);
        });
        values.typeProduct.forEach((value, index) => {
            formData.append(`nameVariants`, value.typeProd);
            formData.append(`priceVariants`, value.priceProd);
            formData.append(`dataVariants`, dataFiles.current[index].originFileObj);

        });
        tagsProduct.current.forEach((value, index) => {
            formData.append(`tags`, value);
        });

        formData.append('nameProduct', values.nameProduct);
        formData.append('userId', getUserId());
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('discount', values.discount);
        formData.append('thumbnail', values.thumbnailProduct.file.originFileObj);
        addProduct(formData)
            .then((res) => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    openNotificationWithIcon('success', "Thêm sản phẩm mới thành công.");
                    form.resetFields();
                    btnAddItem.current.addFirstItem();
                } else {
                    openNotificationWithIcon('error', "Thêm sản phẩm mới thất bại.");
                }
            })
            .catch((err) => {
                setLoading(false);
                openNotificationWithIcon('error', "Đã có lỗi xảy ra vui lòng thử lại sau.");
            })
    }
    const handleTagsChange = (values) => {
        tagsProduct.current = [...values]
    }
    const handleDataFileChange = (values) => {
        dataFiles.current = [...values]
    }
    return (
        <>
            {contextHolder}
            <Spinning spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name='nameProduct' label="Tên sản phẩm:"
                        rules={[
                            {
                                required: true,
                                message: "Tên sản phẩm không để trống."
                            }
                        ]}
                    >
                        <Input placeholder='Tên sản phẩm' />
                    </Form.Item>
                    <Form.Item name='description' label="Mô tả:"
                        rules={[
                            {
                                required: true,
                                message: 'Mô tả sản phẩm không để trống.'
                            }
                        ]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <UploadThumbnail />
                    <UploadImagesProduct />
                    <Form.Item name='discount' label="Giảm giá:"
                        rules={
                            [{
                                required: true,
                                message: 'Giảm giá sản phẩm không để trống.'
                            }]}
                    >
                        <InputNumber placeholder='giảm giá' min={0} max={100} />
                    </Form.Item>
                    <Form.Item name='category' label="Danh mục:"
                        rules={
                            [{
                                required: true,
                                message: 'Danh mục sản phẩm không để trống.'
                            }]}
                    >
                        <Select placeholder="Danh mục" allowClear>
                            {categories.map((value, index) =>
                                <Select.Option key={index} value={value.categoryId}>{value.categoryName}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <UploadProductType handleGetDataFileChange={handleDataFileChange} ref={btnAddItem} />
                    <Form.Item name='tagsProduct' label="Nhãn:" required={true}
                        rules={[
                            (getFieldValue) => ({
                                validator(_, value) {
                                    if (tagsProduct.current.length > 0) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Vui lòng nhập ít nhất 1 nhãn.'));
                                },
                            }),
                        ]}
                    >
                        <AddTagProduct handleTagsChange={handleTagsChange} />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>Xác nhận</Button>
                    </Form.Item>
                </Form >
            </Spinning>
        </>
    );
};
export default AddProduct;