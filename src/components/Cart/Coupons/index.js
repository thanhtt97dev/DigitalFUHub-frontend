import moment from 'moment';
import React, { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import Spinning from "~/components/Spinning";
import { formatPrice, getVietnamCurrentTime } from '~/utils';
import { getCouponByCode } from '~/api/coupon';
import { Button, Typography, Modal, List, Input, Radio } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { NotificationContext } from "~/context/NotificationContext";
import { RESPONSE_CODE_SUCCESS } from '~/constants';

const { Search } = Input;
const { Text } = Typography;
const cx = classNames.bind(styles);


const Coupons = ({ dataPropCouponComponent }) => {

    /// distructuring props

    const {
        isOpenModalCoupons,
        closeModalCoupons,
        coupons,
        setCoupons,
        couponCodeSelecteds,
        setCouponCodeSelecteds,
        shopIdSelected
    } = dataPropCouponComponent;
    ///

    // states
    const [inputCouponCode, setInputCouponCode] = useState('');
    const [isCouponInfoSuccess, setIsCouponInfoSuccess] = useState(false);
    const [couponCodeSelected, setCouponCodeSelected] = useState('');
    //

    // contexts
    const notification = useContext(NotificationContext);
    //


    /// handles

    const handleChangeInputCode = (e) => {
        setInputCouponCode(e.target.value)
    }

    const onChangeCoupon = (e) => {
        setCouponCodeSelected(e.target.value);
    };

    const onClickRadioCoupon = (e) => {
        const value = e.target.value;
        if (value === couponCodeSelected) {
            setCouponCodeSelected(undefined);
        }
    }

    const onSearchCoupon = () => {
        if (!inputCouponCode) {
            notification("error", "Lỗi", "Vui lòng nhập Code để tìm kiếm mã giảm giá.")
            return;
        }

        setIsCouponInfoSuccess(true);
        getCouponByCode(inputCouponCode)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const coupon = data.result;
                        const couponFind = coupons.find(x => x.couponCode === coupon.couponCode);
                        // add coupon private
                        if (!couponFind) {
                            setCoupons((prev) => [...prev, coupon]);
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setTimeout(() => {
                    setIsCouponInfoSuccess(false)
                }, 500)
            });
    }

    const chooseModalCoupon = () => {

        const couponCodeSelectedsFil = couponCodeSelecteds.filter(x => !coupons.some(y => y.couponCode === x.couponCode));
        setCouponCodeSelecteds([...couponCodeSelectedsFil, { shopId: shopIdSelected, couponCode: couponCodeSelected }]);

        closeModalCoupons();
    }
    ///

    return (
        <Modal
            title="Mã giảm giá của Shop"
            open={isOpenModalCoupons}
            onOk={chooseModalCoupon}
            onCancel={closeModalCoupons}
        >
            <Spinning spinning={isCouponInfoSuccess}>
                <Search
                    placeholder="Nhập mã Code"
                    allowClear
                    enterButton="Tìm kiếm"
                    size="large"
                    onSearch={onSearchCoupon}
                    value={inputCouponCode}
                    onChange={handleChangeInputCode}
                    className={cx('margin-bottom-item')}
                />
                <Radio.Group onChange={onChangeCoupon} value={couponCodeSelected} style={{ display: 'block' }} >

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
                                <List.Item key={item.couponId}>
                                    <List.Item.Meta
                                        title={<a href="https://ant.design">{item.couponName}</a>}
                                        description={(<><p>Giảm {formatPrice(item.priceDiscount)} -
                                            {moment(item.endDate).diff(moment(getVietnamCurrentTime()), 'days') <= 2 ?
                                                (<Text type="danger"> HSD: {moment(item.endDate).format('DD.MM.YYYY')} (Sắp hết hạn)</Text>)
                                                : (<> HSD: {moment(item.endDate).format('DD.MM.YYYY')}</>)}</p></>)}
                                    />
                                    <div>
                                        <Radio disabled={item.quantity > 0 ? false : true} value={item.couponCode} onClick={onClickRadioCoupon}></Radio>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </Radio.Group>
            </Spinning>
        </Modal>
    )
}

export default Coupons;

