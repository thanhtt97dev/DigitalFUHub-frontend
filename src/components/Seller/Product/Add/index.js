import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Space, Modal, Upload, Input, Tag, Tooltip, theme, Form, Button, InputNumber, Table } from "antd";
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { readDataFileExcelImportProduct } from "~/utils";
import { PAGE_SIZE } from "~/constants";


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


function UploadThumbnail() {
    const [thumbnailFile, setThumbnailFile] = useState([]);
    const [previewThumbnailImage, setPreviewThumbnailImage] = useState('');
    const [previewThumbnailTitle, setPreviewThumbnailTitle] = useState('');

    const [previewOpen, setPreviewOpen] = useState(false);

    const handleCancel = () => setPreviewOpen(false);

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
    const handleThumbnailPreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewThumbnailImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewThumbnailTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    return (
        <>
            {/* <Space direction='horizontal'> */}
            <Form.Item name='thumbnailProduct' label='Ảnh đại diện sản phẩm:'
                rules={[
                    {
                        required: true,
                        message: 'Ảnh đại diện sản phẩm không để trống.'
                    }
                ]}
            >
                <Upload
                    listType="picture-card"
                    fileList={thumbnailFile}
                    onPreview={handleThumbnailPreview}
                    onChange={handleThumbnailChange}
                    maxCount={1}
                    accept="image/*"
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
            <Modal open={previewOpen} title={previewThumbnailTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="thumbnail"
                    style={{
                        width: '100%',
                    }}
                    src={previewThumbnailImage}
                />
            </Modal>
            {/* </Space> */}
        </>);
}

function UploadImagesProduct() {
    const [previewOpen, setPreviewOpen] = useState(false);

    const [fileImgProdList, setFileImgProdList] = useState([]);
    const [previewImgProd, setPreviewImgProd] = useState('');
    const [previewImgTitle, setPreviewpreviewImgTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

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
    const handleImgProdPreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImgProd(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewpreviewImgTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    return (
        <>
            {/* <Space direction='horizontal'> */}
            <Form.Item name='imagesProduct' label='Ảnh chi tiết sản phẩm (tối đa 5 ảnh):'
                rules={[
                    {
                        required: true,
                        message: 'Ảnh chi tiết sản phẩm không để trống.'
                    }
                ]}
            >
                <Upload
                    listType="picture-card"
                    fileList={fileImgProdList}
                    onPreview={handleImgProdPreview}
                    onChange={handleImgProdChange}
                    multiple={true}
                    maxCount={5}
                    accept="image/*"
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
            <Modal open={previewOpen} title={previewImgTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="thumbnail"
                    style={{
                        width: '100%',
                    }}
                    src={previewImgProd}
                />
            </Modal >
            {/* </Space> */}
        </>
    );
}

function AddTagProduct({ handleTagsChange }) {
    const { token } = theme.useToken();
    const [tags, setTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // const [editInputIndex, setEditInputIndex] = useState(-1);
    // const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef(null);

    // useImperativeHanlde(ref, () => {
    //     return listTagProductRef.current;
    // })

    // const editInputRef = useRef(null);
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    // useEffect(() => {
    //     editInputRef.current?.focus();
    // }, [editInputValue]);
    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        // console.log(newTags);
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
    // const handleEditInputChange = (e) => {
    //     setEditInputValue(e.target.value);
    // };
    // const handleEditInputConfirm = () => {
    //     const newTags = [...tags];
    //     newTags[editInputIndex] = editInputValue;
    //     setTags(newTags);
    //     setEditInputIndex(-1);
    //     setEditInputValue('');
    // };
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
    handleTagsChange(tags);
    return (<Space size={[0, 8]} wrap>
        {tags.map((tag, index) => {
            // if (editInputIndex === index) {
            //     return (
            //         <Input
            //             ref={editInputRef}
            //             key={tag}
            //             size="middle"
            //             style={tagInputStyle}
            //             value={editInputValue}
            //             onChange={handleEditInputChange}
            //             onBlur={handleEditInputConfirm}
            //             onPressEnter={handleEditInputConfirm}
            //         />
            //     );
            // }
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
                    // onDoubleClick={(e) => {
                    //     if (index !== 0) {
                    //         setEditInputIndex(index);
                    //         setEditInputValue(tag);
                    //         e.preventDefault();
                    //     }
                    // }}
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
        })}
        {inputVisible ? (
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
            <Tag style={{ ...tagPlusStyle, padding: '6px', fontSize: '16px' }} icon={<PlusOutlined />} onClick={showInput}

            >
                Thêm tag
            </Tag>
        )}
    </Space>);
}


function UploadProductType({ handleGetDataFileChange }, ref) {

    const [dataFileRead, setDataFileRead] = useState([])
    const btnAddRef = useRef();
    const btnUploadClickIndexRef = useRef();
    const [openModal, setOpenModel] = useState(false)
    const [dataFile, setDataFile] = useState([]);

    useImperativeHandle(ref, () => {
        return {
            addFirstItem() {
                btnAddRef.current.click();
                setDataFile([])
            }
        }
    })

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
    const handlePreviewDataFile = (index) => {
        const file = dataFile[index].originFileObj;
        readDataFileExcelImportProduct(file)
            .then(res => setDataFileRead(res));
        setOpenModel(true);
    }


    handleGetDataFileChange(dataFile);

    return (<Form.List name="typeProduct">
        {(fields, { add, remove }) => (
            <>
                <Space direction='horizontal'>
                    <Form.Item label='Loại sản phẩm:' style={{ marginBottom: -30 }}
                        required={true}
                    />
                </Space>
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
                            <Input placeholder="Tên loại sản phẩm" />
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'priceProd']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Giá loại sản phẩm không để trống',
                                },
                            ]}
                        >
                            <InputNumber min={0} placeholder="Giá loại sản phẩm" />
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'dataFile']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng tải dữ liệu.',
                                },
                            ]}
                        >
                            <Space direction='horizontal' align='start'>
                                <Upload
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={handleDataFileChange}
                                    fileList={dataFile[name] ? [dataFile[name]] : []}>
                                    {dataFile[name] === undefined && <Button onClick={() => btnUploadClickIndexRef.current = name} icon={<UploadOutlined />}>Tải lên</Button>}
                                </Upload>
                                {dataFile[name] !== undefined &&
                                    <div onClick={(e) => {
                                        handlePreviewDataFile(name);
                                        e.preventDefault();
                                    }}>Xem</div>
                                }

                            </Space>

                        </Form.Item>
                        {fields.length > 1 ? (
                            <MinusCircleOutlined onClick={() => {
                                remove(name)
                                // delete file in array
                                let newDataFile = dataFile;
                                newDataFile.splice(name, 1)
                                setDataFile(dataFile)
                            }} />
                        ) : null}

                    </Space>
                ))}
                <Modal style={{
                    height: '200px'
                }} open={openModal} title='Xem trước dữ liệu' footer={null} onCancel={() => setOpenModel(false)}>
                    <Table
                        pagination={{
                            pageSize: PAGE_SIZE,
                            showSizeChanger: false
                        }}
                        rowKey={(record) => record.uid}
                        scroll={{
                            y: 200,
                        }} columns={columns} dataSource={dataFileRead} />
                </Modal >
                <Form.Item>
                    <Button ref={btnAddRef} type="dashed" onClick={() => {
                        add();
                        setDataFile(prev => [...prev, undefined])
                    }} block icon={<PlusOutlined />}>
                        Thêm
                    </Button>
                </Form.Item>

            </>
        )}
    </Form.List>);
}
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
export default forwardRef(UploadProductType)
export { UploadThumbnail, UploadImagesProduct, AddTagProduct, };