import classNames from "classnames/bind";
import { Radio, Space } from "antd";
import { SORTED_BY_SALE, SORTED_BY_DATETIME, SORTED_BY_PRICE_ASC, SORTED_BY_PRICE_DESC } from "~/constants";
import styles from "../SearchProduct.module.scss"

const cx = classNames.bind(styles);
function SortBar({ valueSelected = SORTED_BY_SALE, onChange = () => { } }) {
    return (
        <Space className={cx('wrapper-sort-bar')} >
            <div>Sắp xếp theo</div>
            <Radio.Group buttonStyle="solid" value={valueSelected} onChange={onChange}>
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
export default SortBar;