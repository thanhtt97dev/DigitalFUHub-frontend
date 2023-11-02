/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Form, Image, Input, Modal, Row, Table } from "antd";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import { getListProductOfSeller } from "~/api/product";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

const columns = [
    {
        title: 'ID sản phẩm',
        dataIndex: 'productId',
        width: '15%',
        render: (_, record) => <div>{record.productId}</div>
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        render: (_, record) => <div>
            <Image width={90} src={record.thumbnail} />
            <p>{record.productName}</p>
        </div>
    },
    {
        title: 'Điểm đánh giá',
        dataIndex: 'totalRating',
        render: (_, record) => <div>{record.numberFeedback !== 0 ? record.totalRatingStar / record.numberFeedback : 0}</div>
    },
];

const getInfoProducts = (rowsSelect, lsProductFixed) => {
    let products = [];
    for (let index = 0; index < rowsSelect.length; index++) {
        const product = lsProductFixed.find(p => p.productId === rowsSelect[index]);
        products.push(product)
    }
    return products;
}

function PopupSelectProduct({ lsProductApplied, onSetLsProductApplied, isOpen, onClose }) {

    const [count, setCount] = useState(0);
    const [rowsSelect, setRowsSelect] = useState([]);
    const [lsProductFixed, setLsProductFixed] = useState([])
    const [lsProduct, setLsProduct] = useState([])
    const [paramSearchProduct, setParamSearchProduct] = useState({
        productId: '',
        productName: ''
    })
    const onSelectRowChange = (newSelectedRowKeys, selectedRows) => {
        setRowsSelect(newSelectedRowKeys);
        console.log(selectedRows);
    };
    const rowSelection = {
        lsProductApplied,
        onChange: onSelectRowChange,
    };
    useEffect(() => {
        setRowsSelect(lsProductApplied.map(v => v.productId));
    }, [lsProductApplied])

    useEffect(() => {
        getListProductOfSeller(paramSearchProduct.productId, paramSearchProduct.productName)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setLsProduct(res.data.result);
                    if (count === 0) {
                        setLsProductFixed(res.data.result)
                    }
                    setCount(prev => prev++);
                }
            })
            .catch((err) => {

            })
    }, [paramSearchProduct])


    const handleConfirmRowSelected = () => {
        const infoProducts = getInfoProducts(rowsSelect, lsProductFixed)
        onSetLsProductApplied(infoProducts);
        onClose();
    }
    const handleClosePopupSelectProduct = () => {
        setRowsSelect(lsProductApplied.map((v) => v.productId))
        onClose();
    }
    const handleSearchProduct = ({ productId, productName }) => {
        setParamSearchProduct({
            productId,
            productName
        })
    }

    return <Modal
        width={900}
        style={{
            height: '500px'
        }}
        title="Chọn sản phẩm"
        open={isOpen}
        onCancel={handleClosePopupSelectProduct}
        onOk={handleClosePopupSelectProduct}
        footer={[
            <Button danger onClick={handleClosePopupSelectProduct}>Hủy</Button>,
            <Button type="primary" onClick={handleConfirmRowSelected}>Xác nhận</Button>
        ]}
    >
        <Form
            onFinish={handleSearchProduct}
            fields={[
                {
                    name: 'productId',
                    value: paramSearchProduct.productId,
                },
                {
                    name: 'productName',
                    value: paramSearchProduct.productName,
                },
            ]}
        >
            <Row>
                <Col span={3} offset={1}><label>Mã sản phẩm:  </label></Col>
                <Col span={6}>
                    <Form.Item name="productId" >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}><label>Tên sản phẩm:  </label></Col>
                <Col span={6}>
                    <Form.Item name="productName" >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Button type="primary" htmlType="submit">Tìm kiếm</Button>
                </Col>
            </Row>
        </Form>
        <Table scroll={{ y: 400 }} pagination={false} rowKey={(record) => record.productId} selectedRowKeys={rowSelection} rowSelection={rowSelection} columns={columns} dataSource={lsProduct} />
    </Modal >
}

export default memo(PopupSelectProduct);