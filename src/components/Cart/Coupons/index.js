import moment from 'moment';
import React, { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { getCoupons } from '~/api/coupon';
import { formatPrice, getVietnamCurrentTime } from '~/utils';
import { NotificationContext } from "~/context/NotificationContext";
import { Button, Typography, Modal, List, Spinning, Search } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;
const cx = classNames.bind(styles);

const Coupons = (props) => {
    // distructuring props
    const {
        isOpen,
        onOk,
        onCancel,
        itemCartSelected,
        productVariantsIdSelected,
        setCoupons,
        coupons
    } = props;
    //

    // states
    const [chooseCoupons, setChooseCoupons] = useState([]);
    const [inputCouponCode, setInputCouponCode] = useState('');
    const [isCouponInfoSuccess, setIsCouponInfoSuccess] = useState(false);
    //

    // contexts
    const notification = useContext(NotificationContext);
    //


    // handles
    const onSearch = () => {
        if (!inputCouponCode) {
            notification("error", "Lỗi", "Vui lòng nhập Code để tìm kiếm mã giảm giá.")
            return;
        }
        setIsCouponInfoSuccess(true)
        const cartFind = itemCartSelected.find(c => c.productVariantId === productVariantsIdSelected)
        getCoupons(cartFind.shopId, inputCouponCode)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    setCoupons(data);
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setTimeout(() => {
                    setIsCouponInfoSuccess(false)
                }, 500)
            })
    }


    const handleChangeInputCode = (e) => {
        setInputCouponCode(e.target.value)
    }

    const deleteCoupon = (coupon) => {
        const chooseCouponsFind = chooseCoupons.find(c => c.couponId === coupon.couponId)
        if (chooseCouponsFind) {
            const newChooseCoupons = chooseCoupons.filter(c => c.couponId !== coupon.couponId)
            setChooseCoupons([...newChooseCoupons])
        }

    }

    const addCoupon = (coupon) => {
        const chooseCouponsFind = chooseCoupons.find(c => c.couponId === coupon.couponId)
        if (!chooseCouponsFind) {
            setChooseCoupons((prev) => [...prev, coupon])
        }
    }
    //

    return (
        <Modal
            title="Mã giảm giá của Shop"
            open={isOpen}
            onOk={onOk}
            onCancel={onCancel}
        >
            <Spinning spinning={isCouponInfoSuccess}>
                <Search
                    placeholder="Nhập mã Code"
                    allowClear
                    enterButton="Tìm kiếm"
                    size="large"
                    onSearch={onSearch}
                    value={inputCouponCode}
                    onChange={handleChangeInputCode}
                    className={cx('margin-bottom-item')}
                />
                <div
                    id="scrollableDiv"
                    style={{
                        height: 400,
                        overflow: 'auto',
                        padding: '0 16px',
                        border: '1px solid rgba(140, 140, 140, 0.35)',
                    }}
                >
                    <List
                        dataSource={coupons}
                        renderItem={(item) => (
                            <List.Item key={item.email}>
                                <List.Item.Meta
                                    title={<a href="https://ant.design">{item.couponName}</a>}
                                    description={(<><p>Giảm {formatPrice(item.priceDiscount)} -
                                        {moment(item.endDate).diff(moment(getVietnamCurrentTime()), 'days') <= 2 ?
                                            (<Text type="danger"> HSD: {moment(item.endDate).format('DD.MM.YYYY')} (Sắp hết hạn)</Text>)
                                            : (<> HSD: {moment(item.endDate).format('DD.MM.YYYY')}</>)}</p></>)}
                                />
                                <div>
                                    {
                                        item.quantity > 0 ? (
                                            chooseCoupons.find(c => c.couponId === item.couponId) ? (<Button icon={<DeleteOutlined />} onClick={() => { deleteCoupon(item) }} type="primary" danger>
                                                Xóa
                                            </Button>) : (<Button icon={<PlusOutlined />} type="primary" onClick={() => addCoupon(item)}>Sử dụng</Button>)
                                        ) : (
                                            <Button disabled={true}>Đã hết</Button>
                                        )

                                    }
                                </div>
                            </List.Item>
                        )}
                    />

                </div>


            </Spinning>
        </Modal>
    )
}

export default Coupons;

