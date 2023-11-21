import { useSearchParams } from "react-router-dom";
import { Button, Col, Divider, Form, InputNumber, Layout, Radio, Rate, Row, Space, Typography } from 'antd';
import classNames from "classnames/bind";
import styles from "./Search.module.scss"
import { useEffect, useState } from "react";
import { ALL_CATEGORY, FEEDBACK_TYPE_1_STAR, FEEDBACK_TYPE_2_STAR, FEEDBACK_TYPE_3_STAR, FEEDBACK_TYPE_4_STAR, FEEDBACK_TYPE_5_STAR, FEEDBACK_TYPE_ALL, SORTED_BY_DATETIME, SORTED_BY_PRICE_ASC, SORTED_BY_PRICE_DESC, SORTED_BY_SALE } from "~/constants";
import { FilterOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);
const { Sider, Content } = Layout;
const { Text } = Typography

function FilterGroupRating({ valueSelected, onChange = () => { } }) {
    return (
        <>
            <legend className={cx('filter-header')}>Đánh Giá</legend>
            <Radio.Group style={{ width: '100%' }} buttonStyle="solid" defaultValue={valueSelected} onChange={onChange}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Space.Compact direction="vertical" style={{ width: '100%' }}>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_5_STAR}>
                            <Rate className={cx('rate')} value={5} disabled />
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_4_STAR}>
                            <Rate className={cx('rate')} value={4} disabled /> <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_3_STAR}>
                            <Rate className={cx('rate')} value={3} disabled /> <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_2_STAR}>
                            <Rate className={cx('rate')} value={2} disabled />  <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_1_STAR}>
                            <Rate className={cx('rate')} value={1} disabled /> <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_ALL}>
                            <Rate className={cx('rate')} value={0} disabled /> <span >trở lên</span>
                        </Radio.Button>
                    </Space.Compact>
                </Space>
            </Radio.Group>
        </>
    );
}
function FilterGroupCategory({ listCategory = [], valueSelected = ALL_CATEGORY, onChange = () => { } }) {
    return (
        <>
            <legend className={cx('filter-header')}>Danh Mục</legend>
            <Radio.Group style={{ width: '100%' }} buttonStyle="solid" defaultValue={valueSelected} onChange={onChange}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Space.Compact direction="vertical" style={{ width: '100%' }}>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={ALL_CATEGORY}>
                            <div>Tất cả</div>
                        </Radio.Button>
                        {listCategory?.map((value, index) =>
                            <Radio.Button key={index} className={cx('radio-button', 'search-radio-button-checked')} value={value.categoryId}>
                                <div>{value.categoryName}</div>
                            </Radio.Button>
                        )}
                    </Space.Compact>
                </Space>
            </Radio.Group>
        </>
    );
}
function InputRangePrice({ onChange }) {
    const [msgError, setMsgError] = useState('');
    const handleInputChange = () => {
        // refresh message error
        if (msgError.trim()) {
            setMsgError('')
        }
    }
    const handleSubmitForm = ({ from, to }) => {
        if (from && to && from >= to) {
            setMsgError('Vui lòng điền khoảng giá phù hợp')
        } else {
            onChange(from, to);
        }
    }
    return (
        <>
            <legend className={cx('filter-header')}>Khoảng Giá</legend>
            <Form
                onFinish={handleSubmitForm}
            >
                <Row gutter={[8, 0]}>
                    <Col span={11}>
                        <Form.Item name='from' style={{ width: '100%' }}>
                            <InputNumber onInput={handleInputChange} value={null} style={{ width: '100%' }} min={0} max={1000000000} placeholder="Từ" />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <div>_</div>
                    </Col>
                    <Col span={11}>
                        <Form.Item name='to' style={{ width: '100%' }}>
                            <InputNumber onInput={handleInputChange} value={null} style={{ width: '100%' }} min={0} max={1000000000} placeholder="Đến" />
                        </Form.Item>
                    </Col>
                </Row>
                {msgError &&
                    <Row>
                        <Col span={24}>
                            <Text type="danger">{msgError}</Text>
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

function SortBar({ valueSelected, onChange = () => { } }) {
    return (
        <Space style={{ width: '100%', borderRadius: '10px', backgroundColor: '#ededed', padding: '0.6rem 0.9rem 0.6rem 0.9rem' }}>
            <div>Sắp xếp theo</div>
            <Radio.Group buttonStyle="solid" defaultValue={valueSelected} onChange={onChange}>
                <Space>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_SALE}>
                        <div>Bán chạy</div>
                    </Radio.Button>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_DATETIME}>
                        <div >Mới nhất</div>
                    </Radio.Button>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_PRICE_ASC}>
                        <div >Giá tăng dần</div>
                    </Radio.Button>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_PRICE_DESC}>
                        <div >Giá thấp dần</div>
                    </Radio.Button>
                </Space>
            </Radio.Group>
        </Space>
    );
}

function Search() {
    const [searchParams] = useSearchParams(); //setSearchParams
    useEffect(() => {

    }, [searchParams]);
    const handleChangeSelectRating = (e) => {
        console.log(e.target.value);
    }
    const handleInputRangePrice = (from, to) => {
        console.log(from, to);
    }
    const handleChangeSelectCategory = (e) => {
        console.log(e.target.value);
    }
    const handleChangeSelectSort = (e) => {
        console.log(e.target.value);
    }
    return (
        <Layout className={cx('container')} >
            <Sider className={cx('sider')}>
                <Space style={{ marginBottom: '1.8em' }}>
                    <FilterOutlined style={{ fontSize: '1.17em' }} />
                    <h3> Bộ Lọc Tìm Kiếm</h3>
                </Space>
                <FilterGroupCategory onChange={handleChangeSelectCategory} />
                <Divider />
                <InputRangePrice onChange={handleInputRangePrice} />
                <Divider />
                <FilterGroupRating valueSelected={5} onChange={handleChangeSelectRating} />
                {/* <Divider /> */}
                {/* <legend>Dịch Vụ & Khuyến Mãi</legend> */}
            </Sider>
            <Layout className={cx('wrapper-content')}>
                <Content className={cx('content')}>
                    <SortBar valueSelected={0} onChange={handleChangeSelectSort} />
                </Content>
            </Layout>
        </Layout>
    );
}

export default Search;