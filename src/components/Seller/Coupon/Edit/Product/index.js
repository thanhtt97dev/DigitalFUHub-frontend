/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { PlusOutlined, QuestionCircleOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Image, Input, InputNumber, Row, Space, Switch, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { regexPattern } from "~/utils";
import { RESPONSE_CODE_NOT_ACCEPT, RESPONSE_CODE_SUCCESS } from "~/constants";
import { checkCouponCodeExist } from "~/api/coupon";
import PopupSelectProduct from "../../Add/Product/PopupSelectProduct";
import Column from "antd/es/table/Column";
import debounce from "debounce-promise";

const debounceCheckCouponCodeExist = debounce((value) => {
    const res = checkCouponCodeExist('U', value)
    return Promise.resolve({ res: res });
}, 500);

function AddCouponForProduct({ coupon, onEditCoupon = () => { } }) {
    const [formEdit] = Form.useForm();
    const [lsProductApplied, setLsProductApplied] = useState(coupon.productsApplied)

    const [isOpenPopupSelectProduct, setIsOpenPopupSelectProduct] = useState(false);
    const initialFieldsForm = [
        {
            name: 'couponName',
            value: coupon?.couponName !== undefined ? coupon.couponName : '',
        },
        {
            name: 'couponCode',
            value: coupon?.couponCode !== undefined ? coupon?.couponCode : '',
        },
        {
            name: 'startDate',
            value: dayjs(coupon?.startDate),
        },
        {
            name: 'endDate',
            value: dayjs(coupon?.endDate),
        },
        {
            name: 'priceDiscount',
            value: coupon?.priceDiscount !== undefined ? coupon?.priceDiscount : 0,
        },
        {
            name: 'minTotalOrderValue',
            value: coupon?.minTotalOrderValue !== undefined ? coupon?.minTotalOrderValue : 0,
        },
        {
            name: 'isPublic',
            value: coupon?.isPublic !== undefined ? coupon?.isPublic : true,
        },
        {
            name: 'quantity',
            value: coupon?.quantity !== undefined ? coupon?.quantity : 0,
        }
    ]
    const handleOpenPopupSelectProduct = () => {
        setIsOpenPopupSelectProduct(true);
    }
    const handleClosePopupSelectProduct = () => {
        setIsOpenPopupSelectProduct(false);
    }
    const handleRemoveProductSelected = (productId) => {
        setLsProductApplied(prev => {
            return prev.filter(v => v.productId !== productId);
        })
    }
    const isBeforeDate = current => {
        return current && current < dayjs().startOf('day');
    };
    const onFinish = (values) => {
        values.typeId = coupon.couponTypeId;
        values.productsApplied = lsProductApplied.map(v => v.productId);
        onEditCoupon(values);
    }

    return (<>
        {isOpenPopupSelectProduct && <PopupSelectProduct
            lsProductApplied={lsProductApplied}
            onSetLsProductApplied={setLsProductApplied}
            onClose={handleClosePopupSelectProduct}
            isOpen={isOpenPopupSelectProduct}
        />}
        <Form
            // style={{
            //     maxWidth: '600px'
            // }}
            form={formEdit}
            onFinish={onFinish}
            fields={initialFieldsForm}
        >
            <Row>
                <Col span={5} offset={1}><label>Loại mã giảm giá</label></Col>
                <Col span={10}>
                    <Form.Item>
                        <div>
                            <Space
                                align="center"
                                style={{
                                    border: '1px solid #1677ff',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    color: '#1677ff',
                                    cursor: 'default'
                                }}
                            >
                                <ShoppingOutlined style={{ fontSize: '20px' }} />
                                <div level={5} style={{ color: 'inherit', textAlign: 'center' }}>Mã giảm giá cho các sản phẩm chỉ định</div>
                            </Space>
                        </div>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Tên mã giảm giá <Tooltip title="Tên mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={10}>
                    <Form.Item name="couponName"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const data = value === undefined ? "" : value.trim();
                                    if (data) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject(new Error('Tên mã giảm giá không được trống.'))
                                    }
                                },
                            }),
                        ]}>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Mã giảm giá <Tooltip title="Mã giảm giá áp dụng cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={10}>
                    <Form.Item name="couponCode"
                        validateDebounce={2000}
                        rules={[
                            ({ getFieldValue }) => ({
                                async validator(_, value) {
                                    const data = value === undefined ? '' : value;
                                    if (!data.trim()) {
                                        return Promise.reject(new Error('Mã giảm giá không được trống.'));
                                    } else if (data.length < 4) {
                                        return Promise.reject(new Error('Mã giảm giá phải có ít nhất 4 ký tự.'));
                                    } else if (data.length > 10) {
                                        return Promise.reject(new Error('Mã giảm giá có tối đa 10 ký tự.'));
                                    }
                                    else if (!regexPattern(data, "^[a-zA-Z0-9]{4,10}$")) {
                                        return Promise.reject(new Error('Mã giảm giá không chứa khoảng trắng và các ký tự đặc biệt.'));
                                    }
                                    else {
                                        return new Promise((resolve, reject) => {
                                            debounceCheckCouponCodeExist(data)
                                                .then(({ res }) => {
                                                    res.then(res => {
                                                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                                                            resolve();
                                                        } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                                                            reject(new Error('Mã giảm giá không hợp lệ.'));
                                                        } else {
                                                            reject(new Error('Mã giảm giá không khả dụng.'));
                                                        }
                                                    }).catch(err => {
                                                        reject(new Error('Mã giảm giá không khả dụng.'));
                                                    })
                                                });
                                        })
                                    }
                                },
                            }),
                        ]}>
                        <Input onInput={e => e.target.value = e.target.value.toUpperCase()} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Thời gian giảm giá <Tooltip title="Thời gian áp dụng mã giảm giá cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={10}>
                    <Row gutter={[16, 0]}>
                        <Col span={11}>
                            <Form.Item name="startDate"
                                initialValue={dayjs().add(10, 'minute')}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const endDate = getFieldValue("endDate");
                                            if (value) {
                                                if (value.isBefore(dayjs())) {
                                                    return Promise.reject(new Error("Vui lòng nhập thời gian bắt đầu muộn hơn thời gian hiện tại."));
                                                } else {
                                                    if (endDate) {
                                                        if (endDate.diff(value) < 60 * 60 * 1000) {
                                                            return Promise.reject(new Error("Chương trình phải kéo dài ít nhất là 1h kể từ khi bắt đầu."));
                                                        }
                                                    }
                                                    return Promise.resolve();
                                                }
                                            } else {
                                                return Promise.reject(new Error("Thời gian bắt đầu không để trống."));
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker locale={locale}
                                    style={{ width: '100%' }}
                                    allowClear={false}
                                    disabledDate={isBeforeDate}
                                    format={"M/D/YYYY HH:mm"}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        // defaultValue: dayjs(`${dayjs().add(10, 'minute').hour()}:${dayjs().add(10, 'minute').minute()}`, 'HH:mm'),
                                    }}
                                    placement={"bottomLeft"}
                                    placeholder="Thời gian bắt đầu"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <div style={{ width: '100%', height: '50%', position: 'relative' }}>
                                <div style={{ width: '100%', height: '1px', top: '50%', background: '#bababa', position: 'absolute' }}></div>
                            </div>
                        </Col>
                        <Col span={11}>
                            <Form.Item name="endDate"
                                initialValue={dayjs().add(70, 'minute')}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const startDate = getFieldValue("startDate");
                                            if (value) {
                                                if (startDate) {
                                                    if (value.diff(startDate) < 60 * 60 * 1000) {
                                                        return Promise.reject(new Error("Chương trình phải kéo dài ít nhất là 1h kể từ khi bắt đầu."));
                                                    }
                                                }
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject(new Error("Thời gian kết thúc không để trống."));
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker locale={locale}
                                    style={{ width: '100%' }}
                                    allowClear={false}
                                    disabledDate={isBeforeDate}
                                    format={"M/D/YYYY HH:mm"}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: dayjs(`${dayjs().add(60, 'minute').hour()}:${dayjs().add(60, 'minute').minute()}`, 'HH:mm'),
                                    }}
                                    placement={"bottomLeft"}
                                    placeholder="Thời gian kết thúc"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Giá trị đơn hàng tối thiểu <Tooltip title="Số tiền tối thiểu của đơn hàng để có thể áp dụng được mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={10}>
                    <Form.Item name="minTotalOrderValue"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const priceDiscount = getFieldValue("priceDiscount")
                                    if (value === undefined || value === null) {
                                        return Promise.reject(new Error('Giá trị đơn hàng tối thiểu không được để trống.'));
                                    }
                                    else if (value < 0) {
                                        return Promise.reject(new Error('Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 1000đ.'));
                                    } else if (value > 100000000) {
                                        return Promise.reject(new Error('Giá trị đơn hàng tối thiểu không vượt quá 100.000.000đ'));
                                    } else {
                                        if (value === 0) {
                                            return Promise.resolve();
                                        } else {
                                            if (!priceDiscount) {
                                                return Promise.resolve();
                                            } else {
                                                if (priceDiscount > value) {
                                                    return Promise.reject(new Error('Giá trị đơn hàng tối thiểu không nhỏ hơn số tiền giảm giá'));
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            }
                                        }
                                    }
                                },
                            }),
                        ]}
                    >
                        <InputNumber addonAfter="đ" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Số tiền giảm giá <Tooltip title="Số tiền được giảm khi áp dụng mã cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={10}>
                    <Form.Item name="priceDiscount"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const minTotalOrderValue = getFieldValue("minTotalOrderValue");
                                    if (value === undefined || value === null) {
                                        return Promise.reject(new Error('Số tiền giảm giá không được để trống'));
                                    } else if (value < 1000) {
                                        return Promise.reject(new Error('Số tiền giảm giá phải lớn hơn hoặc bằng 1000đ'));
                                    } else {
                                        if (!minTotalOrderValue) {
                                            return Promise.resolve();
                                        } else {
                                            if (value > (parseInt(minTotalOrderValue * 0.7))) {
                                                return Promise.reject(new Error('Số tiền giảm giá không được lớn hơn 70% Giá trị đơn hàng tối thiểu'));
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }
                                    }
                                },
                            }),
                        ]}
                    >
                        <InputNumber addonAfter="đ" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Số lượng <Tooltip title="Số lượng mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={10}>
                    <Form.Item name="quantity"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value === undefined || value === null) {
                                        return Promise.reject(new Error('Số lượng mã giảm giá không được để trống.'));
                                    } else if (value <= 0) {
                                        return Promise.reject(new Error('Số lượng mã giảm giá phải lớn hơn 0.'));
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            }),
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Thiết lập hiển thị <Tooltip title={<div><p>Công khai: mọi người được đề xuất mã giảm giá này khi đặt hàng.</p><br /><p>Riêng tư: mọi người sẽ phải nhập mã để tìm thấy mã giảm giá này.</p></div>}><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={10}>
                    <Form.Item name="isPublic" valuePropName="checked" >
                        <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={5} offset={1}><label>Sản phẩm được áp dụng <Tooltip title={<div>Mã giảm giá sẽ được áp dụng cho những sản phẩm được chọn.</div>}><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>

                    <Form.Item name="applicableProducts"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (lsProductApplied.length <= 0) {
                                        return Promise.reject(new Error('Vui lòng chọn ít nhất một sản phẩm'));
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            }),
                        ]}
                    >
                        <Space size={[16, 8]}>
                            <span>Đã chọn ({lsProductApplied.length}) sản phẩm</span>
                            <Button type="dashed" danger icon={<PlusOutlined />} onClick={handleOpenPopupSelectProduct}>Chọn sản phẩm</Button>
                        </Space>
                    </Form.Item>
                    {lsProductApplied.length > 0 &&
                        <Table
                            scroll={{ y: 400 }}
                            pagination={false}
                            rowKey={(record) => record.productId}
                            dataSource={lsProductApplied}
                        >
                            <Column
                                width="20%"
                                title="ID sản phẩm"
                                key="productId"
                                render={(_, record) => (
                                    <div>{record.productId}</div>
                                )}
                            />
                            <Column
                                width="65%"
                                title="Tên sản phẩm"
                                key="productName"
                                render={(_, record) => (
                                    <Space size={[8, 8]}>
                                        <Image width={90} src={record.thumbnail} />
                                        <p>{record.productName}</p>
                                    </Space>
                                )}
                            />
                            <Column
                                width="15%"
                                title="Thao tác"
                                key="actions"
                                render={(_, record) => (
                                    <Button type="link" onClick={() => handleRemoveProductSelected(record.productId)}>Xóa</Button>
                                )}
                            />
                        </Table>
                    }
                </Col>
            </Row>
            <Row>
                <Col span={16} style={{ textAlign: 'center', marginTop: '2em' }}>
                    <Button htmlType="submit" type="primary">Xác nhận</Button>
                </Col>
            </Row>
        </Form>
    </>);
}

export default AddCouponForProduct;