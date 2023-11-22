import { useEffect, useState } from "react";
import { Button, Col, Form, InputNumber, Row, Typography } from 'antd';
import classNames from "classnames/bind";
import styles from "../SearchProduct.module.scss"
const cx = classNames.bind(styles);
const { Text } = Typography

function InputRangePrice({ minValue = null, maxValue = null, onChange = () => { } }) {
    const [msgError, setMsgError] = useState('');
    const [minPrice, setMinPrice] = useState(minValue);
    const [maxPrice, setMaxPrice] = useState(maxValue);
    useEffect(() => {
        setMinPrice(minValue);
        setMaxPrice(maxValue);
    }, [minValue, maxValue]);

    const handleInputChange = () => {
        // refresh message error
        if (msgError.trim()) {
            setMsgError('')
        }
    }
    const handleSubmitForm = ({ min, max }) => {
        setMinPrice(min);
        setMaxPrice(max);
        if (min && max && min >= max) {
            setMsgError('Vui lòng điền khoảng giá phù hợp')
        } else {
            setMsgError('');
            onChange(min, max);
        }
    }
    return (
        <>
            <legend className={cx('filter-header')}>Khoảng Giá</legend>
            <Form
                onFinish={handleSubmitForm}
                fields={[
                    {
                        name: 'min',
                        value: minPrice
                    },
                    {
                        name: 'max',
                        value: maxPrice
                    }
                ]}
            >
                <Row gutter={[8, 0]}>
                    <Col span={11}>
                        <Form.Item name='min' style={{ width: '100%' }} >
                            <InputNumber onInput={handleInputChange} style={{ width: '100%' }} min={0} max={1000000000} placeholder="Từ" />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <div>_</div>
                    </Col>
                    <Col span={11}>
                        <Form.Item name='max' style={{ width: '100%' }} >
                            <InputNumber onInput={handleInputChange} style={{ width: '100%' }} min={0} max={1000000000} placeholder="Đến" />
                        </Form.Item>
                    </Col>
                </Row>
                {msgError &&
                    <Row style={{ margin: '-1em 0 1em 0' }}>
                        <Col span={24}>
                            <Text type="danger" style={{ fontSize: '13px' }}>{msgError}</Text>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col span={24}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Áp Dụng</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
export default InputRangePrice