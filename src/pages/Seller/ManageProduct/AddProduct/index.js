import React, { useEffect, useRef, useState } from 'react';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Upload, Form, Input, Select, Space, InputNumber } from 'antd';
import { ReadDataFileExcelImportProduct } from '~/utils';

import { UploadImagesProduct, UploadThumbnail, AddTagProduct, UploadProductType } from '~/components/Seller/Product/Add';

// const getBase64 = (file) =>
//     new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = (error) => reject(error);
//     });

function AddProduct() {
    // const [thumbnailFile, setThumbnailFile] = useState([]);
    // const [previewThumbnailImage, setPreviewThumbnailImage] = useState('');
    // const [previewThumbnailTitle, setPreviewThumbnailTitle] = useState('');
    // const btnAddRef = useRef();
    // const btnUploadClickIndexRef = useRef();
    const tagsProduct = useRef([]);
    const dataFiles = useRef([]);
    // const [previewOpen, setPreviewOpen] = useState(false);

    // const [fileImgProdList, setFileImgProdList] = useState([]);
    // const [previewImgProd, setPreviewImgProd] = useState('');
    // const [previewImgTitle, setPreviewpreviewImgTitle] = useState('');

    // const [dataFile, setDataFile] = useState([]);
    // useEffect(() => {
    //     btnAddRef.current.click();
    // }, [])
    // data file
    // const handleDataFileChange = (info) => {
    //     let newFileList = [...info.fileList];
    //     var mode = newFileList.length !== 0;
    //     let uidFile = info.file.uid;
    //     // onchange delete
    //     if (!mode) {
    //         let indexFileEqUid = -1;
    //         for (let index = 0; index < dataFile.length; index++) {
    //             if (dataFile[index] !== undefined && dataFile[index].uid === uidFile) {
    //                 indexFileEqUid = index;
    //                 break;
    //             }
    //         }
    //         newFileList = [...dataFile];
    //         newFileList.splice(indexFileEqUid, 1)
    //         setDataFile([...newFileList]);
    //     }
    //     // onchange add
    //     else {
    //         // const isExist = !!(dataFile.some(v => v.uid === uidFile))
    //         // if (!isExist) {
    //         newFileList = newFileList.slice(-1);
    //         newFileList = newFileList.map((file) => {
    //             if (file.response) {
    //                 file.url = file.response.url;
    //             }
    //             file.response = '';
    //             file.status = 'done';
    //             return file;
    //         });
    //         setDataFile(prev => {
    //             prev[btnUploadClickIndexRef.current] = newFileList[0]
    //             return [...prev];
    //         });
    //         // }


    //     }
    // }

    // img products
    // const handleImgProdChange = (info) => {
    //     let newFileList = [...info.fileList];
    //     newFileList = newFileList.slice(-8);
    //     newFileList = newFileList.map((file) => {
    //         if (file.response) {
    //             file.url = file.response.url;
    //         }
    //         file.response = '';
    //         file.status = 'done';
    //         return file;
    //     });
    //     setFileImgProdList(newFileList);
    // };
    // const handleImgProdPreview = async (file) => {
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setPreviewImgProd(file.url || file.preview);
    //     setPreviewOpen(true);
    //     setPreviewpreviewImgTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    // };

    // thumnail file
    // const handleThumbnailChange = (info) => {
    //     let newFileList = [...info.fileList];
    //     newFileList = newFileList.slice(-1);
    //     newFileList = newFileList.map((file) => {
    //         if (file.response) {
    //             file.url = file.response.url;
    //         }
    //         file.response = '';
    //         file.status = 'done';
    //         return file;
    //     });
    //     setThumbnailFile(newFileList);
    // };
    // const handleThumbnailPreview = async (file) => {
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setPreviewThumbnailImage(file.url || file.preview);
    //     setPreviewOpen(true);
    //     setPreviewThumbnailTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    // };

    // end thumnail file
    // popup
    // const handleCancel = () => setPreviewOpen(false);


    // if (fileList.length !== 0) {
    //     console.log(fileList.length);
    //     ReadDataFileExcelImportProduct(fileList[0].originFileObj)
    // }

    const onFinish = (values) => {
        console.log(values)
        console.log('data file', dataFiles.current)
        console.log('tag ', tagsProduct.current)
    }
    const handleTagsChange = (values) => {
        tagsProduct.current = [...values]
    }
    const handleDataFileChange = (values) => {
        dataFiles.current = [...values]
    }
    return (
        <>
            <Form
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
                <UploadThumbnail />
                <UploadImagesProduct />
                <Form.Item label="Danh mục:"
                    rules={
                        [{
                            required: true,
                            message: 'Danh mục sản phẩm không để trống.'
                        }]}
                >
                    <Select placeholder="Danh mục" allowClear>
                        <Select.Option value="1">Mạng xã hội</Select.Option>
                        <Select.Option value="2">VPS</Select.Option>
                        <Select.Option value="3">Khác</Select.Option>
                    </Select>
                </Form.Item>
                <UploadProductType handleGetDataFileChange={handleDataFileChange} />
                <Form.Item name='tagsProduct' label="Nhãn:"
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
        </>
    );
};
export default AddProduct;