import { useEffect, useState, useRef, useLayoutEffect, useContext } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotificationContext } from '~/context/UI/NotificationContext';

import { Card, Button, Input, Form, theme, Modal, Select, Upload, InputNumber, Space, Tag, Table, Tooltip, Spin, Switch, Row, Col } from 'antd';
import { PlusOutlined, UploadOutlined, CloseOutlined, QuestionCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { getUserId, readDataFileExcelImportProduct, writeDataToExcel } from "~/utils";
import { getAllCategory } from "~/api/category";
import BoxImage from "~/components/BoxImage";
import maunhapsanpham from "~/assets/files/maunhapsanpham.xlsx"
import { editProductSeller, getProductSellerById } from "~/api/product";
import { MAX_PERCENT_PRODUCT_VARIANT_DISCOUNT, MAX_PRICE_PRODUCT_VARIANT, MIN_PERCENT_PRODUCT_VARIANT_DISCOUNT, MIN_PRICE_PRODUCT_VARIANT, PAGE_SIZE, PRODUCT_ACTIVE, RESPONSE_CODE_SUCCESS, UPLOAD_FILE_SIZE_LIMIT } from "~/constants";
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

function EditProduct() {
    const notification = useContext(NotificationContext);
    const { productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [previewDataFileExcel, setPreviewDataFileExcel] = useState([])
    const btnUploadRef = useRef();
    const [openModal, setOpenModel] = useState(false)
    const [tags, setTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const indexBtnViewOldDataRef = useRef(null);
    const typeButtonViewOldOrNewRef = useRef(null);

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
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewImageTitle, setPreviewImageTitle] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const handleCancel = () => setPreviewOpen(false);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productThumbnailSrc, setProductThumbnailSrc] = useState([]);
    const [productImagesSrc, setProductImagesSrc] = useState([]);
    const [productCategory, setProductCategory] = useState(1);
    // const [productDiscount, setProductDiscount] = useState(0);
    const [productVariants, setProductVariants] = useState([])
    const [isActiveProduct, setIsActiveProduct] = useState()
    const [stateInit, setStateInit] = useState(true)
    const btnAddRef = useRef();
    // const idIntervalRef = useRef();
    // const showItemRef = useRef(false);

    // get product
    useLayoutEffect(() => {
        getProductSellerById(getUserId(), productId)
            .then(async (res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const { productName, description, categoryId, thumbnail, productMedias, tags, productVariants, productStatusId } = res.data.result;
                    setProductName(productName);
                    setProductDescription(description);
                    setProductCategory(parseInt(categoryId));
                    // setProductDiscount(parseInt(discount));
                    setProductThumbnailSrc([{ src: thumbnail, file: null }]);
                    setProductImagesSrc(productMedias.map(v => ({ src: v.url, file: null })));
                    setTags(tags.map((value) => value.tagName));
                    setIsActiveProduct(productStatusId === PRODUCT_ACTIVE ? true : false)
                    setProductVariants(productVariants.map((value) => ({ id: value.productVariantId, nameVariant: value.name, price: value.price, discount: value.discount, data: value.assetInformations, file: undefined })));
                }
            })
            .catch((err) => {
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // get list categories
    useLayoutEffect(() => {
        getAllCategory()
            .then((res) => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    setCategories(res.data.result)
                }
            })
            .catch((err) => {
                setLoading(false);
            })
    }, [])
    // init item product variant old when visit page
    useEffect(() => {
        // idIntervalRef.current = setInterval(() => {
        // console.log(loading);
        if (!loading && productVariants.length > 0 && btnAddRef.current && stateInit) {
            // showItemRef.current = true;
            // console.log(productVariants.length);
            for (let index = 0; index < productVariants.length; index++) {
                btnAddRef.current?.click();
            }
            setStateInit(false);
            // clearInterval(idIntervalRef.current)
        }
        // }, 500)
        // return () => { clearInterval(idIntervalRef.current) }

    }, [loading, productVariants.length, stateInit])

    // handle upload thumbnail
    const handleThumbnailChange = async (info) => {
        if (info.file.size > UPLOAD_FILE_SIZE_LIMIT) {
            setMsgNotificationFileExceedLimit([`"${info.file.name}" không thể được tải lên.`])
            setOpenNotificationFileExceedLimit(true);
        } else {
            const urlBase64 = await getBase64(info.file.originFileObj);
            setProductThumbnailSrc([{ src: urlBase64, file: info.file.originFileObj }])
        }
    };


    // handle upload images product
    const handleImgProdChange = async (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5);
        let newArrays = [];
        var msgFileExceedLimit = [];

        let indexFilesExist = newFileList.map((v, i) => {
            if (v.originFileObj && v.size > UPLOAD_FILE_SIZE_LIMIT) {
                msgFileExceedLimit.push(`"${v.name}" không thể được tải lên.`);
                return i;
            }
            return -1;
        })

        indexFilesExist = indexFilesExist.filter(v => v >= 0)
        if (indexFilesExist.length > 0) {
            newFileList = newFileList.filter((v, i) => !indexFilesExist.includes(i))
            setMsgNotificationFileExceedLimit(msgFileExceedLimit)
            setOpenNotificationFileExceedLimit(true);
        }
        for (let i = 0; i < newFileList.length; i++) {
            if (newFileList[i].name) {
                const urlBase64 = await getBase64(newFileList[i].originFileObj);
                newArrays.push({ src: urlBase64, file: newFileList[i].originFileObj });
            } else {
                newArrays.push(newFileList[i]);
            }
        }
        setProductImagesSrc([...newArrays]);
    };

    // handle data file excel change of product variants
    const handleDataFileChange = (info) => {
        let newFileList = [...info.fileList];
        var mode = newFileList.length !== 0;
        let uidFile = info.file.uid;

        // delete file
        if (!mode) {
            let indexFileEqUid = -1;
            for (let index = 0; index < productVariants.length; index++) {
                if (productVariants[index].file !== undefined && productVariants[index].file.uid === uidFile) {
                    indexFileEqUid = index;
                    break;
                }
            }
            newFileList = [...productVariants];
            newFileList[indexFileEqUid].file = undefined;
            setProductVariants([...newFileList]);
        }
        // upload file
        else {
            newFileList = newFileList.slice(-1);
            if (newFileList && newFileList[0].size <= UPLOAD_FILE_SIZE_LIMIT) {
                newFileList = newFileList.map((file) => {
                    if (file.response) {
                        file.url = file.response.url;
                    }
                    file.response = '';
                    file.status = 'done';
                    return file;
                });
                setProductVariants(prev => {
                    prev[btnUploadRef.current].file = newFileList[0]
                    return [...prev];
                });
            } else {
                var msgFileExceedLimit = `"${newFileList[0].name}" không thể được tải lên.`;
                setMsgNotificationFileExceedLimit([msgFileExceedLimit])
                setOpenNotificationFileExceedLimit(true);
            }
        }
    }
    // handle preview data file excel import
    const handlePreviewDataFileExcel = (index) => {
        const file = productVariants[index].file.originFileObj;
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
        // set fields form
        setIsActiveProduct(values.isActiveProduct);
        setProductName(values.nameProduct);
        setProductCategory(values.category)
        //
        let formData = new FormData();
        formData.append('productId', productId);
        formData.append('userId', getUserId());
        formData.append('productName', values.nameProduct);
        formData.append('productDescription', productDescription);
        formData.append('discount', values.discount);
        formData.append('categoryId', values.category);
        formData.append('isActiveProduct', values.isActiveProduct);
        formData.append('productThumbnailFileUpdate', productThumbnailSrc[0]?.file ? productThumbnailSrc[0]?.file : null);
        productImagesSrc.forEach((value, index) => {
            if (value.file) {
                formData.append('productDetailImagesAddNew', value.file);
            } else {
                formData.append('productDetailImagesCurrent', value.src);
            }
        });
        tags.forEach((tag, index) => {
            formData.append('tags', tag);
        })

        productVariants.forEach((variant, index) => {
            // add new variant
            if (variant.data === undefined && variant.file !== undefined) {
                formData.append('productVariantNamesAddNew', values.productVariants[index].nameVariant);
                formData.append('productVariantPricesAddNew', values.productVariants[index].price);
                formData.append('productVariantDiscountsAddNew', values.productVariants[index].discount);
                formData.append('assetInformationFilesAddNew', variant.file.originFileObj);
            }
            // update variant
            else {
                formData.append('productVariantIdsUpdate', variant.id);
                formData.append('productVariantNamesUpdate', values.productVariants[index].nameVariant);
                formData.append('productVariantPricesUpdate', values.productVariants[index].price);
                formData.append('productVariantDiscountsUpdate', values.productVariants[index].discount);
                formData.append('assetInformationFilesUpdate', variant.file ? variant.file.originFileObj : null);
            }
        })
        editProductSeller(formData)
            .then(res => {
                setLoading(false);
                if (res.data.status.responseCode === '00') {
                    notification('success', 'Cập nhật sản phẩm thành công.');
                } else {
                    notification('error', 'Cập nhật sản phẩm thất bại.');
                }
                return navigate('/seller/product/list')
            })
            .catch(err => {
                setLoading(false);
                notification('error', 'Đã có lỗi xảy ra.');
                return navigate('/seller/product/list')
            })

    }
    const handleDownloadDataOld = async () => {
        const now = new Date();
        const buffer = await writeDataToExcel(productVariants[indexBtnViewOldDataRef.current]?.data)
        let blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}.xlsx`;
        link.click();
        URL.revokeObjectURL(link.href);
        link.remove();
    }
    const [openNotificationFileExceedLimit, setOpenNotificationFileExceedLimit] = useState(false);
    const [msgNotificationFileExceedLimit, setMsgNotificationFileExceedLimit] = useState([]);
    const handleCloseNotificationFileExceedLimit = () => {
        setMsgNotificationFileExceedLimit([]);
        setOpenNotificationFileExceedLimit(false);
    }
    return (
        <>
            <Spin spinning={loading}>
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
                <Modal open={previewOpen} title={previewImageTitle} footer={null} onCancel={handleCancel}>
                    <img
                        alt="thumbnail"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal >

                <Card
                    style={{
                        width: '100%',
                        minHeight: "690px"
                    }}
                    title={<div><Link to={'/seller/product/list'}><LeftOutlined />Trở về</Link>&nbsp; Cập nhật sản phẩm</div>}
                >
                    <Form
                        form={form}
                        fields={[
                            {
                                name: ["nameProduct"],
                                value: productName,
                            },
                            // {
                            //     name: ["discount"],
                            //     value: productDiscount,
                            // },
                            {
                                name: ["category"],
                                value: productCategory,
                            },
                            {
                                name: ["isActiveProduct"],
                                value: isActiveProduct
                            }
                        ]}
                        layout="vertical"
                        style={{
                            maxWidth: '100%',
                            padding: '0 20%'
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item name='nameProduct' label={<lable style={{ fontSize: 14 }}>Tên sản phẩm <Tooltip title="Tên sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>} required
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
                        <Form.Item name='description' label={<lable style={{ fontSize: 14 }}>Mô tả <Tooltip title="Mô tả sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>} required
                            rules={[
                                (getFieldValue) => ({
                                    validator(_, value) {
                                        if (productDescription.trim()) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mô tả sản phẩm không để trống.'));
                                    },
                                }),
                            ]}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data={productDescription}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'undo', 'redo',]
                                }}
                                onReady={editor => {
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setProductDescription(data);
                                }}
                                onBlur={(event, editor) => {
                                }}
                                onFocus={(event, editor) => {
                                }}
                            />
                            {/* </CKEditorContext> */}
                        </Form.Item>
                        {/* <UploadThumbnail /> */}
                        <Form.Item name='thumbnailProduct' label={<lable style={{ fontSize: 14 }}>Ảnh đại diện sản phẩm (Hình ảnh tỷ lệ 1:1) <Tooltip title="Ảnh đại diện sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>} required
                            validateTrigger={["onBlur", "onChange", "onFocus", "onMouseEnter", "onMouseLeave", "onKeyDown"]}
                            rules={[
                                (getFieldValue) => ({
                                    validator(_, value) {
                                        if (productThumbnailSrc[0] !== undefined) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Ảnh đại diện sản phẩm không để trống.'));
                                    },
                                }),
                            ]}
                        >
                            <Space direction="horizontal" style={{ marginTop: `${productThumbnailSrc[0] === undefined ? '0px' : '8px'}` }}>
                                {
                                    productThumbnailSrc[0] !== undefined
                                    && <BoxImage src={productThumbnailSrc[0].src}
                                        onPreview={() => {
                                            var filename = productThumbnailSrc[0].file !== null ?
                                                productThumbnailSrc[0].file.name :
                                                productThumbnailSrc[0].src.substring(productThumbnailSrc[0].src.lastIndexOf('/') + 1);
                                            setPreviewImage(productThumbnailSrc[0].src);
                                            setPreviewImageTitle(filename);
                                            setPreviewOpen(true);
                                        }} onRemove={() => setProductThumbnailSrc([])} />
                                }
                                <Upload
                                    beforeUpload={false}
                                    listType="picture-card"
                                    fileList={productThumbnailSrc}
                                    showUploadList={false}
                                    // onPreview={handlePreviewImage}
                                    onChange={handleThumbnailChange}
                                    maxCount={1}
                                    accept=".png, .jpeg, .jpg"
                                >
                                    {productThumbnailSrc[0] === undefined ? <div>
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
                            </Space>
                        </Form.Item>

                        {/* <UploadImagesProduct /> */}

                        <Form.Item name='productImages' label={<lable style={{ fontSize: 14 }}>Ảnh chi tiết sản phẩm (Hình ảnh tỷ lệ 1:1, tối đa 5 ảnh) <Tooltip title="Ảnh chi tiết sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>} required
                            validateTrigger={["onBlur", "onChange", "onFocus", "onMouseEnter", "onMouseLeave", "onKeyDown"]}
                            rules={[
                                (getFieldValue) => ({
                                    validator(_, value) {
                                        if (productImagesSrc.length > 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Ảnh chi tiết sản phẩm không để trống.'));
                                    },
                                }),
                            ]}
                        >
                            <Space direction="horizontal">
                                {productImagesSrc.map((v, i) => <BoxImage src={v.src} key={i}
                                    onRemove={() => {
                                        let newArrays = productImagesSrc;
                                        newArrays.splice(i, 1);
                                        setProductImagesSrc([...newArrays]);
                                    }}
                                    onPreview={() => {
                                        var filename = productImagesSrc[i].file !== null ? productImagesSrc[i].file.name :
                                            productImagesSrc[i].src.substring(productImagesSrc[i].src.lastIndexOf('/') + 1);
                                        setPreviewImage(productImagesSrc[i].src);
                                        setPreviewImageTitle(filename);
                                        setPreviewOpen(true);
                                    }}
                                />)}
                                <Upload
                                    beforeUpload={false}
                                    listType="picture-card"
                                    fileList={productImagesSrc}
                                    showUploadList={false}
                                    // onPreview={handlePreviewImage}
                                    onChange={handleImgProdChange}
                                    multiple={true}
                                    style={{ width: '100%' }}
                                    maxCount={5}
                                    accept=".png, .jpeg, .jpg"
                                >

                                    {productImagesSrc.length < 5 ? <div>
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
                            </Space>

                        </Form.Item>

                        {/* <Form.Item name='discount' label={<lable style={{  fontSize: 14 }}>Giảm giá <Tooltip title="Giảm giá của sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>}
                            rules={
                                [{
                                    required: true,
                                    message: 'Giảm giá sản phẩm không để trống.'
                                }]}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder='giảm giá' addonAfter="%" min={0} max={100} />
                        </Form.Item> */}
                        <Form.Item name='category' label={<lable style={{ fontSize: 14 }}>Danh mục <Tooltip title="Danh mục của sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>}
                            rules={
                                [{
                                    required: true,
                                    message: 'Danh mục sản phẩm không để trống.'
                                }]}
                        >
                            <Select placeholder="Danh mục">
                                {categories.map((value, index) =>
                                    <Select.Option key={index} value={value.categoryId} >{value.categoryName}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>

                        {/* <UploadProductType handleGetDataFileChange={handleDataFileChange} ref={btnAddItem} /> */}
                        <Form.List name="productVariants"
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    <Space direction='horizontal'>
                                        <Form.Item label={<div style={{ fontSize: 14 }}>Loại sản phẩm <a href={maunhapsanpham} download>Tải mẫu nhập sản phẩm</a>
                                            <Tooltip title="Loại sản phẩm, nếu chưa có mẫu nhập sản phẩm vui lòng nhấn vào tải mẫu nhập sản phẩm. Khi cập nhật lại sản phẩm mọi dữ liệu cũ sẽ bị xóa."><QuestionCircleOutlined /></Tooltip></div>} style={{ marginBottom: -30, display: 'flex' }}
                                            required={true}
                                        >
                                        </Form.Item>

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
                                                        let newData = productVariants;
                                                        newData.splice(name, 1)
                                                        setProductVariants(newData)
                                                    }} />
                                                ) : null}
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'nameVariant']}
                                                    rules={[
                                                        (getFieldValue) => ({
                                                            validator(_, value) {
                                                                const data = value === undefined ? '' : value.trim();
                                                                if (data.trim()) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Tên loại sản phẩm không để trống.'));
                                                            },
                                                        }),
                                                    ]}
                                                    initialValue={productVariants[name]?.nameVariant}
                                                >
                                                    <Input placeholder="Tên loại sản phẩm" />

                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    rules={[
                                                        (getFieldValue) => ({
                                                            validator(_, value) {
                                                                if (value !== null || value !== undefined) {
                                                                    if (value < MIN_PRICE_PRODUCT_VARIANT) {
                                                                        return Promise.reject(new Error('Giá loại sản phẩm tối thiểu là 1.000đ.'));
                                                                    } else if (value > MAX_PRICE_PRODUCT_VARIANT) {
                                                                        return Promise.reject(new Error('Giá loại sản phẩm tối đa là 100.000.000đ.'));
                                                                    }
                                                                    else {
                                                                        return Promise.resolve();
                                                                    }
                                                                }
                                                                return Promise.reject(new Error('Giá loại sản phẩm không để trống.'));
                                                            },
                                                        }),
                                                    ]}
                                                    initialValue={productVariants[name]?.price}
                                                >
                                                    <InputNumber style={{ width: '100%' }} min={0} addonAfter="đ" placeholder="Giá loại sản phẩm" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'discount']}
                                                    initialValue={productVariants[name]?.discount}
                                                    rules={[
                                                        (getFieldValue) => ({
                                                            validator(_, value) {
                                                                if (value !== null || value !== undefined) {
                                                                    if (value < MIN_PERCENT_PRODUCT_VARIANT_DISCOUNT) {
                                                                        return Promise.reject(new Error('Phần trăm giảm giá tối thiểu là 0%.'));
                                                                    } else if (value > MAX_PERCENT_PRODUCT_VARIANT_DISCOUNT) {
                                                                        return Promise.reject(new Error('Phần trăm giảm giá tối đa là 50%.'));
                                                                    } else {
                                                                        return Promise.resolve();
                                                                    }
                                                                }
                                                                return Promise.reject(new Error('Phần trăm giảm giá sản phẩm không để trống.'));
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
                                                                if (productVariants[name]?.data !== undefined || productVariants[name]?.file !== undefined) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Vui lòng tải dữ liệu.'));
                                                            },
                                                        }),
                                                    ]}
                                                >

                                                    <Space direction='horizontal' align='start'>
                                                        {productVariants[name]?.data
                                                            &&
                                                            <Button type='primary' onClick={(e) => {
                                                                const data = productVariants[name]?.data.map((value, index) => ({ index: index + 1, value: value.asset }))
                                                                setPreviewDataFileExcel(data)
                                                                typeButtonViewOldOrNewRef.current = 1;
                                                                indexBtnViewOldDataRef.current = name;
                                                                setOpenModel(true)
                                                            }}>Dữ liệu cũ</Button>
                                                        }

                                                        <Upload
                                                            beforeUpload={false}
                                                            // accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                            onChange={handleDataFileChange}
                                                            fileList={productVariants[name]?.file ? [productVariants[name]?.file] : []}>
                                                            {productVariants[name]?.file === undefined && <Button onClick={() => btnUploadRef.current = name} icon={<UploadOutlined />}>Tải lên</Button>}
                                                        </Upload>
                                                        {productVariants[name]?.file !== undefined &&
                                                            <Button type='primary' onClick={(e) => {
                                                                handlePreviewDataFileExcel(name);
                                                                typeButtonViewOldOrNewRef.current = 2;
                                                                e.preventDefault();
                                                            }}>Xem dữ liệu mới</Button>
                                                        }
                                                    </Space>
                                                </Form.Item>
                                            </Card>
                                        </Space>
                                    ))}
                                    <Modal style={{
                                        height: '200px'
                                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                    }} open={openModal} title={productVariants[indexBtnViewOldDataRef.current]?.data && typeButtonViewOldOrNewRef.current === 1 ? <div>Dữ liệu cũ <a onClick={handleDownloadDataOld}>tải xuống</a></div> : 'Xem trước dữ liệu'} footer={null} onCancel={() => setOpenModel(false)}>
                                        <Table
                                            rowKey={(record) => record.index}
                                            pagination={{
                                                pageSize: PAGE_SIZE,
                                                showSizeChanger: false
                                            }}
                                            scroll={{
                                                y: 200,
                                            }} columns={columns} dataSource={previewDataFileExcel} />
                                    </Modal >
                                    <Form.Item>
                                        <Button ref={btnAddRef} type="dashed" onClick={() => {
                                            if (!stateInit) {
                                                const dataItem = { id: 0, nameVariant: '', price: '', data: undefined, file: undefined }
                                                setProductVariants(prev => [...prev, dataItem])
                                            }
                                            add();
                                        }} block icon={<PlusOutlined />}>
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item name='tagsProduct' label={<lable style={{ fontSize: 14 }}>Nhãn <Tooltip title="Nhãn của sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>} required={true}
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
                        <Form.Item name='isActiveProduct' label={<lable style={{ fontSize: 14 }}>Trạng thái <Tooltip title="Trạng thái hiện mọi người sẽ thấy sản phẩm của bạn, trạng thái ẩn mọi người sẽ không thấy sản phẩm của bạn."><QuestionCircleOutlined /></Tooltip></lable>} required={true}
                            valuePropName="checked"
                        >
                            <Switch value={isActiveProduct} checkedChildren="Hiện" unCheckedChildren="Ẩn" />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type='primary' size='large' htmlType='submit'>Xác nhận</Button>
                        </Form.Item>
                    </Form >
                </Card>
            </Spin >
        </>
    );

}

export default EditProduct;
