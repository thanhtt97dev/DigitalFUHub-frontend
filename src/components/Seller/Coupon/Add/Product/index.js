/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Image, Input, InputNumber, Modal, Row, Switch, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { regexPattern } from "~/utils";
import { RESPONSE_CODE_NOT_ACCEPT, RESPONSE_CODE_SUCCESS } from "~/constants";
import { checkCouponCodeExist } from "~/api/coupon";
import { getAllProductsSeller } from "~/api/product";
import PopupSelectProduct from "./PopupSelectProduct";
import Column from "antd/es/table/Column";
function AddCouponForProduct({ onAddCoupon = () => { } }) {
    const [formAdd] = Form.useForm();
    const [lsProductApplied, setLsProductApplied] = useState([])

    const [isOpenPopupSelectProduct, setIsOpenPopupSelectProduct] = useState(false);
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
        onAddCoupon(values);
    }

    return (<>
        <PopupSelectProduct
            lsProductApplied={lsProductApplied}
            onSetLsProductApplied={setLsProductApplied}
            onClose={handleClosePopupSelectProduct}
            isOpen={isOpenPopupSelectProduct}
        />
        <Form
            // style={{
            //     maxWidth: '600px'
            // }}
            form={formAdd}
            onFinish={onFinish}
        >
            <Row>
                <Col span={8} offset={1}><label>Tên mã giảm giá: <Tooltip title="Tên mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
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
                <Col span={8} offset={1}><label>Mã giảm giá: <Tooltip title="Mã giảm giá áp dụng cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
                    <Form.Item name="couponCode"
                        rules={[
                            ({ getFieldValue }) => ({
                                async validator(_, value) {
                                    const data = value === undefined ? '' : value;
                                    if (!data.trim()) {
                                        return Promise.reject(new Error('Mã giảm giá không được trống.'));
                                    } else if (data.length < 4) {
                                        return Promise.reject(new Error('Mã giảm giá phải có ít nhất 4 kí tự.'));
                                    } else if (!regexPattern(data, "^[a-zA-Z0-9]{4,}$")) {
                                        return Promise.reject(new Error('Mã giảm giá không chứa khoảng trắng và các ký tự đặc biệt.'));
                                    }
                                    else {
                                        await checkCouponCodeExist('A', data)
                                            .then((res) => {
                                                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                                                    return Promise.resolve();
                                                } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                                                    return Promise.reject(new Error('Mã giảm giá không hợp lệ.'));
                                                } else {
                                                    return Promise.reject(new Error('Mã giảm giá không khả dụng.'));
                                                }
                                            })
                                            .catch((err) => {
                                                return Promise.reject(new Error('Mã giảm giá không khả dụng.'));
                                            })
                                    }
                                },
                            }),
                        ]}>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8} offset={1}><label>Thời gian giảm giá: <Tooltip title="Thời gian áp dụng mã giảm giá cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
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
                <Col span={8} offset={1}><label>Giá trị đơn hàng tối thiểu: <Tooltip title="Số tiền tối thiểu của đơn hàng để có thể áp dụng được mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
                    <Form.Item name="minTotalOrderValue"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value === undefined || value === null) {
                                        return Promise.reject(new Error('Số tiền đơn hàng tối thiểu không được để trống.'));
                                    } else if (value < 1000) {
                                        return Promise.reject(new Error('Số tiền đơn hàng tối thiểu phải lớn hơn hoặc bằng 1000đ.'));
                                    } else {
                                        return Promise.resolve();
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
                <Col span={8} offset={1}><label>Số tiền giảm giá: <Tooltip title="Số tiền được giảm khi áp dụng mã cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
                    <Form.Item name="priceDiscount"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    // if (getFieldValue('amountOrderConditionNew') === undefined || getFieldValue('amountOrderConditionNew') === null) {
                                    //     return Promise.reject(new Error('Vui lòng nhập số tiền cho đơn hàng tối thiểu.'));
                                    // } else 
                                    if (value === undefined || value === null) {
                                        return Promise.reject(new Error('Số tiền giảm giá không được để trống.'));
                                    } else if (value < 1000) {
                                        return Promise.reject(new Error('Số tiền giảm giá phải lớn hơn hoặc bằng 1000đ.'));
                                    }
                                    // else if (value > getFieldValue('amountOrderConditionNew')) {
                                    //     return Promise.reject(new Error('Số tiền giảm giá phải nhỏ hơn hoặc bằng giá tiền đơn hàng tối thiểu.'));
                                    // }
                                    else {
                                        return Promise.resolve();
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
                <Col span={8} offset={1}><label>Số lượng: <Tooltip title="Số lượng mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
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
                <Col span={8} offset={1}><label>Thể loại: <Tooltip title={<div><p>Công khai: mọi người được đề xuất mã giảm giá này khi đặt hàng.</p><br /><p>Riêng tư: mọi người sẽ phải nhập mã để tìm thấy mã giảm giá này.</p></div>}><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
                    <Form.Item name="isPublic" valuePropName="checked" initialValue={true}>
                        <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8} offset={1}><label>Sản phẩm được áp dụng: <Tooltip title={<div>Mã giảm giá sẽ được áp dụng cho những sản phẩm được chọn.</div>}><QuestionCircleOutlined /></Tooltip></label></Col>
                <Col span={15}>
                    <Form.Item name="applicableProducts">
                        <Button type="dashed" danger icon={<PlusOutlined />} onClick={handleOpenPopupSelectProduct}>Chọn sản phẩm</Button>
                    </Form.Item>
                    {lsProductApplied.length > 0 &&
                        <Table
                            scroll={{ y: 400 }}
                            pagination={false}
                            rowKey={(record) => record.productId}
                            dataSource={lsProductApplied}
                        >
                            <Column
                                width="15%"
                                title="ID sản phẩm"
                                key="productId"
                                render={(_, record) => (
                                    <div>{record.productId}</div>
                                )}
                            />
                            <Column
                                width="70%"
                                title="Tên sản phẩm"
                                key="productName"
                                render={(_, record) => (
                                    <div>
                                        <Image width={90} src={record.thumbnail} />
                                        <p>{record.productName}</p>
                                    </div>
                                )}
                            />
                            <Column
                                width="15%"
                                title=""
                                key="actions"
                                render={(_, record) => (
                                    <Button type="link" onClick={() => handleRemoveProductSelected(record.productId)}>Xóa</Button>
                                )}
                            />
                        </Table>
                    }
                </Col>
            </Row>
            <Row justify="center">
                <Col offset={1}>
                    <Button htmlType="submit" type="primary">Xác nhận</Button>
                </Col>
            </Row>
        </Form>
    </>);
}

export default AddCouponForProduct;