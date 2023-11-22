import { Radio, Rate, Space } from 'antd';
import classNames from "classnames/bind";
import { FEEDBACK_TYPE_1_STAR, FEEDBACK_TYPE_2_STAR, FEEDBACK_TYPE_3_STAR, FEEDBACK_TYPE_4_STAR, FEEDBACK_TYPE_5_STAR, FEEDBACK_TYPE_ALL } from "~/constants";
import styles from "../SearchProduct.module.scss"
const cx = classNames.bind(styles);

function FilterGroupRating({ valueSelected, onChange = () => { } }) {
    return (
        <>
            <legend className={cx('filter-header')}>Đánh Giá</legend>
            <Radio.Group style={{ width: '100%' }} buttonStyle="solid" value={valueSelected} onChange={onChange}>
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
export default FilterGroupRating;