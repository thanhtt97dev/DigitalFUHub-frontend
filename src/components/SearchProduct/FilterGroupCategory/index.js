import { Radio, Space } from 'antd';
import classNames from "classnames/bind";
import styles from "../SearchProduct.module.scss"
import { ALL_CATEGORY } from "~/constants";
const cx = classNames.bind(styles);
function FilterGroupCategory({ listCategory = [], valueSelected = ALL_CATEGORY, onChange = () => { } }) {
    return (
        <>
            <legend className={cx('filter-header')}>Danh Mục</legend>
            <Radio.Group style={{ width: '100%' }} buttonStyle="solid" value={valueSelected} onChange={onChange}>
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
export default FilterGroupCategory;