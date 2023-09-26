import { useState, useRef, useEffect, forwardRef } from "react";
import { Space, Modal, Upload, Input, Tag, Tooltip, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";


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
    return (<Space direction='horizontal'>
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
    </Space>);
}

function UploadImagesProduct() {
    const [previewOpen, setPreviewOpen] = useState(false);

    const [fileImgProdList, setFileImgProdList] = useState([]);
    const [previewImgProd, setPreviewImgProd] = useState('');
    const [previewImgTitle, setPreviewpreviewImgTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handleImgProdChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-8);
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
    return (<Space direction='horizontal'>
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
    </Space>);
}

function AddTagProduct(props, ref) {
    console.log(ref);
    const { token } = theme.useToken();
    const [tags, setTags] = useState([]);
    ref.current = [...tags];
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    // const [editInputIndex, setEditInputIndex] = useState(-1);
    // const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef(null);
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
        console.log(newTags);
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
export default forwardRef(AddTagProduct);
export { UploadThumbnail, UploadImagesProduct };