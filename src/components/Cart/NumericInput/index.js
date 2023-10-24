import React, { useState } from 'react';
import { Input } from 'antd';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';

const cx = classNames.bind(styles);

const NumericInput = ({ value, onBlur }) => {
    const [quantity, setQuantity] = useState(value);

    const handleChange = (e) => {

        const reg = /^[1-9]\d*$/;
        const targetValue = e.target.value
        if (reg.test(targetValue)) {
            setQuantity(e.target.value)
        }
    }

    return (
        <Input
            className={cx('input-num')}
            value={quantity}
            onChange={handleChange}
            onBlur={onBlur}
        />
    );
};

export default NumericInput;