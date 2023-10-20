
import { Tooltip } from 'antd';

import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './BoxImage.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function BoxImage({ src, onPreview = () => { }, onRemove = () => { } }) {
    return <div className={cx('container-img')} style={{ marginTop: '-8px' }}>
        <div className={cx('content-img')}>
            <div className={cx('content-blur')}>
                <div className={cx('options')}>
                    <Tooltip title="Preview">
                        <EyeOutlined onClick={onPreview} className={cx('option-item')} style={{ color: 'white', fontSize: '16px' }} />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <DeleteOutlined onClick={onRemove} className={cx('option-item')} style={{ color: 'white', fontSize: '16px' }} />
                    </Tooltip>
                </div>
            </div>
            <div className={cx('wrap-img')}>
                <img className={cx('img')} alt="" src={src} />
            </div>
        </div>
    </div>;
}

export default BoxImage;