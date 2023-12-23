/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Form, Image, Input, Modal, Row, Space, Table } from "antd";
import { memo, useEffect, useState } from "react";
import { getListProductOfSeller } from "~/api/product";
import { PAGE_SIZE, RESPONSE_CODE_SUCCESS } from "~/constants";

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
        render: (_, record) => <Space size={[8, 8]}>
            <Image width={80} height={80} preview={false} src={record.thumbnail} />
            <p>{record.productName}</p>
        </Space>
    },
    {
        title: 'Doanh số',
        width: '20%',
        dataIndex: 'soldCount',
        render: (_, record) => <div>{record.soldCount}</div>
    },
];

const filterProductsDuplicate = (rowsSelect, lsProductApplied) => {
    let products = [];
    for (let index = 0; index < rowsSelect.length; index++) {
        if (!lsProductApplied.some(v => v.productId === rowsSelect[index].productId)) {
            products.push(rowsSelect[index])
        }
    }
    return products;
}

function PopupSelectProduct({ lsProductApplied, onSetLsProductApplied, isOpen, onClose }) {
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const [lsProduct, setLsProduct] = useState([])
    const [paramSearchProduct, setParamSearchProduct] = useState({
        productId: '',
        productName: '',
        page: page
    })
    // const onSelectRowChange = (newSelectedRowKeys, selectedRows) => {
    //     setSelectedRows(selectedRows);
    // };
    const onSelectandDeselectRowChange = (record, selected, selectedRows, nativeEvent) => {
        if (!selected) {
            setSelectedRows(prev => {
                const result = prev.filter(v => v.productId !== record.productId);
                return [...result];
            })
        } else {
            setSelectedRows(prev => [...prev, record])
        }
    }
    const onSelectandDeselectAllRowChange = (selected, selectedRows, changeRows) => {
        // console.log(selected, selectedRows, changeRows);
        if (selected) {
            setSelectedRows(prev => {
                if (changeRows.length > 0) {
                    let newSelectedRows = [];
                    for (let i = 0; i < changeRows.length; i++) {
                        if (!prev.some(v => v.productId === changeRows[i].productId)) {
                            newSelectedRows.push(changeRows[i])
                        }
                    }
                    return [...prev, ...newSelectedRows];
                } else {
                    return [...prev]
                }
            });
        } else {
            setSelectedRows(prev => {
                if (changeRows.length > 0) {
                    const newSelectedRows = prev.filter(v => !changeRows.some(cr => cr.productId === v.productId));
                    return newSelectedRows;
                } else {
                    return [...prev]
                }
            })
        }

    }
    const rowSelection = {
        selectedRowKeys: selectedRows.map(v => v?.productId),
        // onChange: onSelectRowChange,
        onSelect: onSelectandDeselectRowChange,
        onSelectAll: onSelectandDeselectAllRowChange,
        getCheckboxProps: (record) => {
            return {
                disabled: lsProductApplied.some(v => v.productId === record.productId),
                name: record.productId,
            };
        },
    };
    useEffect(() => {
        setSelectedRows(lsProductApplied);
    }, [lsProductApplied])

    useEffect(() => {
        getListProductOfSeller(paramSearchProduct.productId, paramSearchProduct.productName, page)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setLsProduct(res.data.result.products);
                    setTotalItems(res.data.result.totalItems);
                }
            })
            .catch((err) => {

            })
    }, [paramSearchProduct])


    const handleConfirmRowSelected = () => {
        const products = filterProductsDuplicate(selectedRows, lsProductApplied)
        onSetLsProductApplied(prev => [...prev, ...products]);
        onClose();
    }
    const handleClosePopupSelectProduct = () => {
        // setSelectedRows(lsProductApplied);
        onClose();
    }
    const handleSearchProduct = ({ productId, productName }) => {
        setPage(1);
        setParamSearchProduct({
            productId: !productId ? '' : productId.trim(),
            productName: !productName ? '' : productName.trim(),
            page: 1
        })
    }
    const handleTableChange = (pagination, filters, sorter) => {
        if (pagination.current !== page && pagination.current <= pagination.total) {
            setPage(pagination.current)
            setParamSearchProduct({
                productId: paramSearchProduct.productId,
                productName: paramSearchProduct.productName,
                page: pagination.current
            })
        }
    };

    return <Modal
        width={850}
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
                <Col span={5}>
                    <Form.Item name="productId" >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}><label>Tên sản phẩm:  </label></Col>
                <Col span={5}>
                    <Form.Item name="productName" >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={3} offset={1}>
                    <Button type="primary" htmlType="submit" ghost>Tìm kiếm</Button>
                </Col>
            </Row>
        </Form>
        <div>Đã chọn ({selectedRows.length} sản phẩm)</div>
        <Table
            rowClassName={record => lsProductApplied.some(v => v.productId === record.productId) && "disabled-row"}
            scroll={{ y: 400 }}
            pagination={{
                current: page,
                total: totalItems,
                pageSize: PAGE_SIZE,
                showSizeChanger: false
            }}
            onChange={handleTableChange}
            rowKey={(record) => record.productId}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={lsProduct} />
    </Modal >
}

export default memo(PopupSelectProduct);