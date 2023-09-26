import React, { useEffect, useRef, useState } from 'react';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Upload, Form, Input, Modal, Space } from 'antd';
import { ReadDataFileExcelImportProduct } from '~/utils';

import AddTagProduct, { UploadImagesProduct, UploadThumbnail } from '~/components/Seller/Product/Add';

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
    const btnAddRef = useRef();
    const btnUploadClickIndexRef = useRef();
    const listTagProductRef = useRef([]);

    console.log(listTagProductRef);
    // const [previewOpen, setPreviewOpen] = useState(false);

    // const [fileImgProdList, setFileImgProdList] = useState([]);
    // const [previewImgProd, setPreviewImgProd] = useState('');
    // const [previewImgTitle, setPreviewpreviewImgTitle] = useState('');

    const [dataFile, setDataFile] = useState([]);
    useEffect(() => {
        btnAddRef.current.click();
    }, [])
    // data file
    const handleDataFileChange = (info) => {
        let newFileList = [...info.fileList];
        var mode = newFileList.length !== 0;
        let uidFile = info.file.uid;
        // onchange delete
        if (!mode) {
            let indexFileEqUid = -1;
            for (let index = 0; index < dataFile.length; index++) {
                if (dataFile[index] !== undefined && dataFile[index].uid === uidFile) {
                    indexFileEqUid = index;
                    break;
                }
            }
            newFileList = [...dataFile];
            newFileList.splice(indexFileEqUid, 1)
            setDataFile([...newFileList]);
        }
        // onchange add
        else {
            // const isExist = !!(dataFile.some(v => v.uid === uidFile))
            // if (!isExist) {
            newFileList = newFileList.slice(-1);
            newFileList = newFileList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                file.response = '';
                file.status = 'done';
                return file;
            });
            setDataFile(prev => {
                prev[btnUploadClickIndexRef.current] = newFileList[0]
                return [...prev];
            });
            // }


        }
    }

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

    return (
        <>
            <Form
                layout="vertical"
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item label="Tên sản phẩm:">
                    <Input />
                </Form.Item>
                <Form.Item label="Ảnh đại diện sản phẩm:">
                    <UploadThumbnail />
                    {/* <Space direction='horizontal'>
                        <Upload
                            listType="picture-card"
                            fileList={thumbnailFile}
                            onPreview={handleThumbnailPreview}
                            onChange={handleThumbnailChange}
                        >
                            {thumbnailFile.length < 1 ? <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    Tải lên
                                </div>
                            </div> : null}
                        </Upload>
                        <Modal open={previewOpen} title={previewThumbnailTitle} footer={null} onCancel={handleCancel}>
                            <img
                                alt="thumbnail"
                                style={{
                                    width: '100%',
                                }}
                                src={previewThumbnailImage}
                            />
                        </Modal>
                    </Space> */}
                </Form.Item>
                <Form.Item label="Ảnh chi tiết sản phẩm (tối đa 5 ảnh):">
                    {/* <Space direction='horizontal'>
                        <Upload
                            listType="picture-card"
                            fileList={fileImgProdList}
                            onPreview={handleImgProdPreview}
                            onChange={handleImgProdChange}
                            multiple={true}
                        >
                            {fileImgProdList.length < 5 ? <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    Tải lên
                                </div>
                            </div> : null}
                        </Upload>
                        <Modal open={previewOpen} title={previewImgTitle} footer={null} onCancel={handleCancel}>
                            <img
                                alt="thumbnail"
                                style={{
                                    width: '100%',
                                }}
                                src={previewImgProd}
                            />
                        </Modal>
                    </Space> */}
                    <UploadImagesProduct />
                </Form.Item>
                <Form.List name="types">
                    {(fields, { add, remove }) => (
                        <>
                            <Form.Item label='Loại sản phẩm:' style={{ marginBottom: 0 }} />
                            {fields.map(({ key, name, ...restField }) => (

                                <Space
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                    }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'typeProd']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Loại sản phẩm không để trống.',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Loại sản phẩm" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'last']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng tải dữ liệu.',
                                            },
                                        ]}
                                    >
                                        <Space direction='horizontal' align='start'>
                                            <Upload
                                                onChange={handleDataFileChange}
                                                fileList={dataFile[name] ? [dataFile[name]] : []}>
                                                {dataFile[name] === undefined && <Button onClick={() => btnUploadClickIndexRef.current = name} icon={<UploadOutlined />}>Tải lên</Button>}
                                            </Upload>
                                        </Space>
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined onClick={() => {
                                            remove(name)
                                            // delete index file in array
                                            let newDataFile = dataFile;
                                            newDataFile.splice(name, 1)
                                            setDataFile(dataFile)
                                        }} />
                                    ) : null}

                                </Space>
                            ))}
                            <Form.Item>
                                <Button ref={btnAddRef} type="dashed" onClick={() => {
                                    add();
                                    setDataFile(prev => [...prev, undefined])
                                }} block icon={<PlusOutlined />}>
                                    Thêm
                                </Button>
                            </Form.Item>
                            <Form.Item label="Nhãn:"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng tải dữ liệu.',
                                    },
                                ]}>
                                <AddTagProduct ref={listTagProductRef} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </>
    );
};
export default AddProduct;