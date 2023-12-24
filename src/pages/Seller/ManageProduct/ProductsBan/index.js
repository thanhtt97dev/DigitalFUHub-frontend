import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Row, Col, Space, Select, Input, Button, InputNumber, Tooltip, Image, Table } from 'antd';

import { NotificationContext } from "~/context/UI/NotificationContext";

import Spinning from "~/components/Spinning";

import { getProductsOfSeller } from "~/api/product";
import { getAllCategory } from "~/api/category"
import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_NOT_ACCEPT,
    PRODUCT_BAN,
    RESPONSE_CODE_SHOP_BANNED
} from "~/constants";
import { getUserId } from "~/utils"

import { formatPrice, sliceText } from "~/utils";

import classNames from 'classnames/bind';
import styles from './ProductBan.module.scss';
import ModalViewReasonBanProduct from "~/components/Modals/ModalViewReasonBanProduct";
import { SearchOutlined } from "@ant-design/icons";
const cx = classNames.bind(styles);


const columns = [
    {
        title: 'ID',
        dataIndex: 'productId',
        width: '5%',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productId',
        render: (productId, record) => {
            return (
                <Row>
                    <Col>
                        <Image src={record.productThumbnail} preview={false} width={56} height={56} />
                    </Col>
                    <Col style={{ paddingLeft: "10px" }}>
                        <Row>
                            <b>{sliceText(record.productName, 29)}</b>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                            <Col offset={1} span={10}>
                                <Row>
                                    <Tooltip placement="top" title="Số lượt xem">
                                        <i className={cx('shopee-icon')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8,3 C11.2768566,3 14.2509832,4.73532307 15.8639541,7.49526828 C16.0461435,7.80701139 16.0461267,8.19275955 15.8639103,8.50448682 C14.2503225,11.2649365 11.2766689,13 8,13 C4.72361081,13 1.74984512,11.2651739 0.136703532,8.50585685 C-0.0454653311,8.19425267 -0.0455747862,7.8086603 0.136417142,7.49695275 C1.74851701,4.73582102 4.72261636,3 8,3 Z M8,4 C5.00862607,4 2.39683566,5.60872276 1,8.0011597 C2.39756369,10.3917256 5.00904299,12 8,12 C10.990957,12 13.6024363,10.3917256 15.0005844,7.99984002 C13.6031643,5.60872276 10.9913739,4 8,4 Z M8,4.5 C9.93299662,4.5 11.5,6.06700338 11.5,8 C11.5,9.93299662 9.93299662,11.5 8,11.5 C6.06700338,11.5 4.5,9.93299662 4.5,8 C4.5,6.06700338 6.06700338,4.5 8,4.5 Z M8,5.5 C6.61928813,5.5 5.5,6.61928813 5.5,8 C5.5,9.38071187 6.61928813,10.5 8,10.5 C9.38071187,10.5 10.5,9.38071187 10.5,8 C10.5,6.61928813 9.38071187,5.5 8,5.5 Z"></path></svg>
                                        </i>
                                    </Tooltip>
                                    <span className={cx('text-gray')}>{record.viewCount}</span>
                                </Row>
                            </Col>
                            <Col offset={1} span={10}>
                                <Row>
                                    <Tooltip placement="top" title="Số lượt thích">
                                        <i className={cx('shopee-icon')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.71842712,13.881728 L2.23834957,8.40165043 C0.773883476,6.93718434 0.773883476,4.56281566 2.23834957,3.09834957 C3.65231683,1.68438231 5.9145167,1.63562482 7.38698276,2.9520771 L8.072,3.628 L8.60244214,3.09834957 C10.0669082,1.63388348 12.4412769,1.63388348 13.905743,3.09834957 C15.3702091,4.56281566 15.3702091,6.93718434 13.905743,8.40165043 L8.42553789,13.881732 C8.23027112,14.0769864 7.9136917,14.0769846 7.71842712,13.881728 Z M13.1986362,7.69454365 C14.272578,6.62060185 14.272578,4.87939815 13.1986362,3.80545635 C12.1246944,2.73151455 10.3834907,2.73151455 9.30902064,3.80598425 L8.42760306,4.68608625 C8.23313326,4.8802658 7.91840125,4.88109992 7.72290493,4.68795389 L6.72047402,3.69757431 L6.72047402,3.69757431 C5.637171,2.72905166 3.97820217,2.77271053 2.94545635,3.80545635 C1.87151455,4.87939815 1.87151455,6.62060185 2.94545635,7.69454365 L8.07198849,12.8210758 L13.1986362,7.69454365 Z"></path></svg>
                                        </i>
                                    </Tooltip>
                                    <span className={cx('text-gray')}>{record.likeCount}</span>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )
        },
        width: '40%',
    },
    {
        title: 'Phân loại hàng',
        dataIndex: 'productVariants',
        render: (productVariants, record) => {
            return (
                productVariants.map(element => {
                    return <Row>{sliceText(element.productVariantName, 33)}</Row>
                })
            )
        },
        width: '30%',
    },
    {
        title: 'Giá',
        dataIndex: 'productVariants',
        render: (productVariants, record) => {
            return (
                productVariants.map(element => {
                    return <Row>{formatPrice(element.productVariantPrice)}</Row>
                })
            )
        },
        width: '15%',
    },
    {
        title: 'Kho hàng',
        dataIndex: 'productVariants',
        render: (productVariants, record) => {
            return (
                productVariants.map(element => {
                    return <Row>{element.stock}</Row>
                })
            )
        },
        width: '10%',
    },
    {
        title: 'Doanh số',
        dataIndex: 'soldCount',
        width: '10%',
    },
    {
        title: '',
        dataIndex: 'productId',
        fixed: 'right',
        render: (productId, record) => {
            return (
                <Space direction="vertical">
                    <ModalViewReasonBanProduct content={record.note} BanDate={record.banDate} />
                </Space>
            )
        },
        width: '10%',
    },
];



const initFormValues = [
    {
        name: 'productId',
        value: "",
    },
    {
        name: 'shopName',
        value: "",
    },
    {
        name: 'productName',
        value: "",
    },
    {
        name: 'productCategory',
        value: 0,
    },
    {
        name: 'soldMin',
        value: "",
    },
    {
        name: 'soldMax',
        value: "",
    },

];

function ProductsBan() {

    const [loading, setLoading] = useState(false);
    const notification = useContext(NotificationContext);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const userId = getUserId()

    const [searchParams, setSearchParams] = useState({
        userId: userId,
        productName: "",
        productCategory: 0,
        soldMin: 0,
        soldMax: 0,
        productStatusId: PRODUCT_BAN,
        page: 1
    })
    const [dataTable, setDataTable] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [categories, setCategories] = useState([])

    useEffect(() => {
        getAllCategory()
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setCategories(res.data.result)
                }
            })
            .catch((err) => {

            })
    }, [])

    useEffect(() => {
        setLoading(true)
        getProductsOfSeller(searchParams)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.products)
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: res.data.result.totalProduct,
                        },
                    });
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đang bị khóa.")
                    // return navigate('/shopBanned')
                } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                    notification('error', "Tham số tìm kiếm không hợp lệ!");
                    setLoading(false)
                }

            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const handleTableChange = (pagination, filters, sorter) => {
        setSearchParams({
            ...searchParams,
            page: pagination.current
        })
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setDataTable([]);
        }
    };

    const onFinish = (values) => {
        var productId = values.productId === "" ? 0 : values.productId
        var productName = values.productName;
        var productCategory = values.productCategory
        var soldMin = values.soldMin === "" ? 0 : values.soldMin
        var soldMax = values.soldMax === "" ? 0 : values.soldMax
        setSearchParams({
            ...searchParams,
            userId,
            productId,
            productName,
            productCategory,
            soldMin,
            soldMax
        })
    };
    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({ productCategory: 0 });
    };
    return (
        <Spinning spinning={loading}>
            <Card
                style={{
                    width: '100%',
                    minHeight: '200px',
                    marginBottom: "20px"
                }}
            >

                <Form
                    form={form}
                    onFinish={onFinish}
                    fields={initFormValues}
                >
                    <Row>
                        <Col span={12}>
                            <Row >
                                <Col span={6} offset={2}><label>Mã sản phẩm: </label></Col>
                                <Col span={12}>
                                    <Form.Item name="productId" >
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}><label>Tên sản phẩm: </label></Col>
                                <Col span={12}>
                                    <Form.Item name="productName" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row >
                                <Col span={6} offset={2}><label>Thể loại: </label></Col>
                                <Col span={12}>
                                    <Form.Item name="productCategory" >
                                        <Select >
                                            <Select.Option value={0}>Tất cả</Select.Option>
                                            {categories.map((category, index) => {
                                                return (
                                                    <>
                                                        <Select.Option key={index} value={category.categoryId}>{category.categoryName}</Select.Option>
                                                    </>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}><label>Doanh số</label></Col>
                                <Col span={5}>
                                    <Form.Item name="soldMin" >
                                        <Input placeholder="Tối thiểu" />
                                    </Form.Item>
                                </Col>
                                <Col offset={1}>-</Col>
                                <Col offset={1} span={5}>
                                    <Form.Item name="soldMax" >
                                        <Input placeholder="Tối đa" />
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={2}>
                                    <Space>
                                        <Button htmlType="button" onClick={onReset} >
                                            Xóa
                                        </Button>
                                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                            Tìm kiếm
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Form>
            </Card>
            <Card>
                <Table
                    columns={columns}
                    rowKey={(record, index) => index}
                    dataSource={dataTable}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                    scroll={{
                        x: 1100,
                    }}
                />
            </Card>
        </Spinning>
    );
}

export default ProductsBan;