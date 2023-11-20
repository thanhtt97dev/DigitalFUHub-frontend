import React, { useEffect, useRef, useState, useContext } from 'react';
import { PlusOutlined, UploadOutlined, CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, InputNumber, Upload, Modal, Table, Space, theme, Tag, Tooltip, Card, Spin } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Spinning from '~/components/Spinning';
import { NotificationContext } from '~/context/UI/NotificationContext';
import maunhapsanpham from "~/assets/files/maunhapsanpham.xlsx"
import { getUserId, readDataFileExcelImportProduct } from '~/utils';
import { getAllCategory } from '~/api/category';
import { useNavigate } from 'react-router-dom';
import { addProductSeller } from '~/api/product';
import { MAX_PERCENT_PRODUCT_VARIANT_DISCOUNT, MAX_PRICE_PRODUCT_VARIANT, MIN_PERCENT_PRODUCT_VARIANT_DISCOUNT, MIN_PRICE_PRODUCT_VARIANT } from '~/constants';

const columns = [
    {
        title: 'Số thứ tự',
        dataIndex: 'index',
        key: 'index',
        render: (text, record) => <div key={record.index}>{text}</div>,
    },
    {
        title: 'Dữ liệu sản phẩm',
        dataIndex: 'value',
        key: 'value',
        render: (text, record) => <div key={record.index}>{text}</div>,
    }
];


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function AddProduct() {
    const notification = useContext(NotificationContext);
    const [descriptionValue, setDescriptionValue] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState([]);
    const [fileImgProdList, setFileImgProdList] = useState([]);
    const [previewDataFileExcel, setPreviewDataFileExcel] = useState([])
    const btnAddRef = useRef();
    const btnUploadRef = useRef();
    const [openModal, setOpenModel] = useState(false)
    const [excelFileList, setExcelFileList] = useState([]);
    const [tags, setTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const { token } = theme.useToken();
    const tagInputStyle = {
        width: 64,
        // height: 22,
        // marginInlineEnd: 8,
        // verticalAlign: 'top',
    };
    const tagPlusStyle = {
        // height: 22,
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [previewImage, setPreviewImage] = useState('');
    const [previewImageTitle, setPreviewImageTitle] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const navigate = useNavigate();

    const handlePreviewImage = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewImageTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewOpen(false);

    // const dataFiles = useRef([]);


    // get list categories
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

    // handle upload thumbnail

    const handleThumbnailChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setThumbnailFile(newFileList);
    };

    // handle upload images product
    const handleImgProdChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setFileImgProdList(newFileList);
    };


    // add first box input product variants when visit page
    // useEffect(() => {
    //     btnAddRef.current.click();
    // }, [])

    // handle data file excel change
    const handleDataFileChange = (info) => {
        let newFileList = [...info.fileList];
        var mode = newFileList.length !== 0;
        let uidFile = info.file.uid;

        // delete file
        if (!mode) {
            let indexFileEqUid = -1;
            for (let index = 0; index < excelFileList.length; index++) {
                if (excelFileList[index] !== undefined && excelFileList[index].uid === uidFile) {
                    indexFileEqUid = index;
                    break;
                }
            }
            newFileList = [...excelFileList];
            newFileList[indexFileEqUid] = undefined;
            // newFileList.splice(indexFileEqUid, 1)
            setExcelFileList([...newFileList]);
        }
        // upload file
        else {
            newFileList = newFileList.slice(-1);
            newFileList = newFileList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                file.response = '';
                file.status = 'done';
                return file;
            });
            setExcelFileList(prev => {
                prev[btnUploadRef.current] = newFileList[0]
                return [...prev];
            });
        }
    }
    const handlePreviewDataFileExcel = (index) => {
        const file = excelFileList[index].originFileObj;
        readDataFileExcelImportProduct(file)
            .then(res => setPreviewDataFileExcel(res));
        setOpenModel(true);
    }

    // handle tags product

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue.trim() && !tags.includes(inputValue)) {
            setTags([...tags, inputValue.trim()]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    // submit form
    const onFinish = (values) => {
        setLoading(true);
        let formData = new FormData();
        values.productImages.fileList.forEach((file, index) => {
            formData.append(`productDetailImageFiles`, file.originFileObj);
        });
        values.productVariants.forEach((value, index) => {
            formData.append(`productVariantNames`, value.typeProd);
            formData.append(`productVariantPrices`, value.priceProd);
            formData.append(`productVariantDiscounts`, value.discount);
            formData.append(`assetInformationFiles`, excelFileList[index].originFileObj);

        });
        tags.forEach((value, index) => {
            formData.append(`tags`, value);
        });

        formData.append('productName', values.nameProduct);
        formData.append('userId', getUserId());
        formData.append('description', descriptionValue);
        formData.append('category', values.category);
        // formData.append('discount', values.discount);
        formData.append('thumbnailFile', values.thumbnailProduct.file.originFileObj);
        addProductSeller(formData)
            .then((res) => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    notification('success', "Thêm sản phẩm mới thành công.");
                    // form.resetFields();
                    // setTags([]);
                    // setThumbnailFile([]);
                    // setFileImgProdList([]);
                    // setExcelFileList([]);
                    // btnAddRef.current.click();
                } else {
                    notification('error', "Thêm sản phẩm mới thất bại.");
                }
                return navigate('/seller/product/list')
            })
            .catch((err) => {
                setLoading(false);
                notification('error', "Đã có lỗi xảy ra.");
                return navigate('/seller/product/list')
            })
    }

    return (
        <>
            <Spin spinning={loading}>
                <Card
                    onScroll={(e) => { console.log(e.y) }}
                    style={{
                        width: '100%',
                        minHeight: "690px",
                    }}
                    title="Thêm sản phẩm"
                >
                    <Modal open={previewOpen} title={previewImageTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt="thumbnail"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal >
                    <Form
                        form={form}
                        layout="vertical"
                        style={{
                            maxWidth: '100%',
                            padding: '0 20%'
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item name='nameProduct' label={<lable style={{ fontWeight: 'bold', fontSize: 14 }}>Tên sản phẩm <Tooltip title="Tên sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>} required
                            rules={[
                                (getFieldValue) => ({
                                    validator(_, value) {
                                        const data = value === undefined ? '' : value.trim();
                                        if (data.trim()) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Tên sản phẩm không để trống.'));
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder='Tên sản phẩm' />
                        </Form.Item>
                        <Form.Item name='description' label={<lable style={{ fontWeight: 'bold', fontSize: 14 }}>Mô tả <Tooltip title="Mô tả sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>} required
                            rules={[
                                (getFieldValue) => ({
                                    validator(_, value) {
                                        if (descriptionValue.trim()) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mô tả sản phẩm không để trống.'));
                                    },
                                }),
                            ]}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data=""
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'undo', 'redo',]
                                }}
                                onReady={editor => {
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    // console.log({ event, editor, data });
                                    setDescriptionValue(data);
                                }}
                                onBlur={(event, editor) => {
                                    // console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    // console.log('Focus.', editor);
                                }}
                            />
                        </Form.Item>
                        <Form.Item name='thumbnailProduct' label={<lable style={{ fontWeight: 'bold', fontSize: 14 }}>Ảnh đại diện sản phẩm (Hình ảnh tỷ lệ 1:1) <Tooltip title="Ảnh đại diện sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Ảnh đại diện sản phẩm không để trống.'
                                }
                            ]}
                        >
                            <Upload
                                beforeUpload={false}
                                listType="picture-card"
                                fileList={thumbnailFile}
                                onPreview={handlePreviewImage}
                                onChange={handleThumbnailChange}
                                maxCount={1}
                                accept=".png, .jpeg, .jpg"
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
                        </Form.Item>
                        <Form.Item name='productImages' label={<lable style={{ fontWeight: 'bold', fontSize: 14 }}>Ảnh chi tiết sản phẩm (Hình ảnh tỷ lệ 1:1, tối đa 5 ảnh) <Tooltip title="Ảnh chi tiết của sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Ảnh chi tiết sản phẩm không để trống.'
                                }
                            ]}
                        >
                            <Upload
                                beforeUpload={false}
                                listType="picture-card"
                                fileList={fileImgProdList}
                                onPreview={handlePreviewImage}
                                onChange={handleImgProdChange}
                                multiple={true}
                                maxCount={5}
                                accept=".png, .jpeg, .jpg"
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
                        </Form.Item>
                        {/* <Form.Item name='discount' label={<lable style={{ fontWeight: 'bold', fontSize: 14 }}>Giảm giá <Tooltip title="Phần trăm giảm giá sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>}
                            rules={
                                [{
                                    required: true,
                                    message: 'Giảm giá sản phẩm không để trống.'
                                }]}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder='Giảm giá' addonAfter="%" min={0} max={100} />
                        </Form.Item> */}
                        <Form.Item name='category' label={<lable style={{ fontWeight: 'bold', fontSize: 14 }}>Danh mục <Tooltip title="Danh mục của sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>}
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
                        <Form.List name="productVariants"
                            initialValue={[{
                                typeProd: '',
                                priceProd: ''
                            }]}
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    <Space direction='horizontal'>
                                        <Form.Item label={<div style={{ fontWeight: 'bold', fontSize: 14 }}>Loại sản phẩm <a href={maunhapsanpham} download>Tải mẫu nhập sản phẩm</a> <Tooltip title="Phân loại của sản phẩm, nếu chưa có mẫu nhập sản phẩm vui lòng nhấn vào tải mẫu nhập sản phẩm."><QuestionCircleOutlined /></Tooltip></div>} style={{ marginBottom: -30 }}
                                            required={true}
                                        />
                                    </Space>
                                    {fields.map(({ key, name, ...restField }) => (

                                        <Space
                                            key={key}
                                            style={{
                                                // display: 'flex',
                                                display: 'block',
                                                marginBottom: 8,
                                            }}
                                            align="baseline"
                                        >
                                            <Card style={{ width: '100%' }}
                                                title={<lable style={{ fontWeight: 300, fontSize: 14 }}>Phân loại {name + 1}</lable>}
                                                extra={fields.length > 1 ? (
                                                    <CloseOutlined onClick={() => {
                                                        remove(name)
                                                        // delete file in array
                                                        let newDataFile = excelFileList;
                                                        newDataFile.splice(name, 1)
                                                        setExcelFileList(newDataFile)
                                                    }} />
                                                ) : null}
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'typeProd']}
                                                    rules={[
                                                        (getFieldValue) => ({
                                                            validator(_, value) {
                                                                const data = value === undefined ? '' : value.trim();
                                                                console.log(value);
                                                                if (data.trim()) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Tên loại sản phẩm không để trống.'));
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Input placeholder="Tên loại sản phẩm" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'priceProd']}
                                                    rules={[
                                                        (getFieldValue) => ({
                                                            validator(_, value) {
                                                                if (value !== null || value !== undefined) {
                                                                    if (value < MIN_PRICE_PRODUCT_VARIANT) {
                                                                        return Promise.reject(new Error('Giá loại sản phẩm tối thiểu là 1000đ.'));
                                                                    } else if (value > MAX_PRICE_PRODUCT_VARIANT) {
                                                                        return Promise.reject(new Error('Giá loại sản phẩm tối đa là 100.000.000đ.'));
                                                                    }
                                                                    else {
                                                                        return Promise.resolve();
                                                                    }
                                                                } else {
                                                                    return Promise.reject(new Error('Giá loại sản phẩm không để trống.'));
                                                                }
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <InputNumber style={{ width: '100%' }} min={0} addonAfter="đ" placeholder="Giá loại sản phẩm" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'discount']}
                                                    rules={[
                                                        (getFieldValue) => ({
                                                            validator(_, value) {
                                                                if (value !== null || value !== undefined) {
                                                                    if (value < MIN_PERCENT_PRODUCT_VARIANT_DISCOUNT) {
                                                                        return Promise.reject(new Error('Phần trăm giảm giá tối thiểu là 0%.'));
                                                                    } else if (value > parseInt(MAX_PERCENT_PRODUCT_VARIANT_DISCOUNT * 100)) {
                                                                        return Promise.reject(new Error('Phần trăm giảm giá tối đa là 50%.'));
                                                                    }
                                                                    else {
                                                                        return Promise.resolve();
                                                                    }
                                                                } else {
                                                                    return Promise.reject(new Error('Phần trăm giảm giá sản phẩm không để trống.'));
                                                                }
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <InputNumber style={{ width: '100%' }} min={0} addonAfter="%" placeholder="Phần trăm giảm giá" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    required={true}
                                                    name={[name, 'dataFile']}
                                                    validateTrigger={["onBlur", "onFocus", "onInput", "onChange", "onMouseEnter", "onMouseLeave", "onMouseOver"]}
                                                    rules={[
                                                        (getFieldValue) => ({
                                                            validator(_, value) {
                                                                if (excelFileList[name] !== undefined) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Vui lòng tải dữ liệu.'));
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Space direction='horizontal' align='start'>
                                                        <Upload
                                                            beforeUpload={false}
                                                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                            onChange={handleDataFileChange}
                                                            fileList={excelFileList[name] ? [excelFileList[name]] : []}>
                                                            {excelFileList[name] === undefined && <Button onClick={() => btnUploadRef.current = name} icon={<UploadOutlined />}>Tải lên</Button>}
                                                        </Upload>
                                                        {excelFileList[name] !== undefined &&
                                                            <Button type='primary' onClick={(e) => {
                                                                handlePreviewDataFileExcel(name);
                                                                e.preventDefault();
                                                            }}>Xem trước dữ liệu</Button>
                                                        }

                                                    </Space>

                                                </Form.Item>
                                            </Card>
                                        </Space>
                                    ))}
                                    <Modal style={{
                                        height: '200px'
                                    }} open={openModal} title='Xem trước dữ liệu' footer={null} onCancel={() => setOpenModel(false)}>
                                        <Table
                                            rowKey={(record) => record.index}
                                            scroll={{
                                                y: 200,
                                            }} columns={columns} dataSource={previewDataFileExcel} />
                                    </Modal >
                                    <Form.Item>
                                        <Button ref={btnAddRef} type="dashed" onClick={() => {
                                            add();
                                            setExcelFileList(prev => [...prev, undefined])
                                        }} block icon={<PlusOutlined />}>
                                            Thêm
                                        </Button>
                                    </Form.Item>

                                </>
                            )}
                        </Form.List>
                        <Form.Item name='tagsProduct' label={<div style={{ fontWeight: 'bold', fontSize: 14 }}>Nhãn <Tooltip title="Nhãn của sản phẩm."><QuestionCircleOutlined /></Tooltip></div>} required={true}

                            validateTrigger={["onBlur", "onChange", "onFocus", "onMouseEnter", "onMouseLeave", "onKeyDown"]}
                            rules={
                                [
                                    (getFieldValue) => ({
                                        validator(_, value) {
                                            if (tags.length > 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Vui lòng nhập ít nhất 1 nhãn.'));
                                        },
                                    }),
                                ]}
                        >
                            {/* <AddTagProduct handleTagsChange={handleTagsChange} /> */}
                            < Space size={[0, 8]} wrap >
                                {
                                    tags.map((tag, index) => {
                                        const isLongTag = tag.length > 20;
                                        const tagElem = (
                                            <Tag
                                                key={tag}
                                                color="#87d068"
                                                closable={index !== -1}
                                                style={{
                                                    userSelect: 'none',
                                                    padding: '6px', fontSize: '16px'
                                                }}
                                                onClose={() => handleClose(tag)}
                                            >
                                                <span
                                                >
                                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                </span>
                                            </Tag>
                                        );
                                        return isLongTag ? (
                                            <Tooltip title={tag} key={tag}>
                                                {tagElem}
                                            </Tooltip>
                                        ) : (
                                            tagElem
                                        );
                                    })
                                }
                                {
                                    inputVisible ? (
                                        <Input
                                            ref={inputRef}
                                            type="text"
                                            size="medium"
                                            style={{ ...tagInputStyle, fontSize: '16px', padding: '6px' }}
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onBlur={handleInputConfirm}
                                            onPressEnter={handleInputConfirm}
                                        />
                                    ) : (
                                        <Tag style={{ ...tagPlusStyle, padding: '6px', fontSize: '16px' }} icon={<PlusOutlined />} onClick={showInput}>
                                            Thêm nhãn
                                        </Tag>
                                    )}
                            </Space>
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type='primary' size='large' htmlType='submit'>Xác nhận</Button>
                        </Form.Item>
                    </Form >
                </Card>
            </Spin >
        </>
    );
};
export default AddProduct;