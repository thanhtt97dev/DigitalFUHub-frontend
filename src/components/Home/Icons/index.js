import React from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/Home/Home.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faGraduationCap, faGamepad, faBriefcase, faServer, faEllipsisH, faListUl } from "@fortawesome/free-solid-svg-icons";
///
const cx = classNames.bind(styles);
///

const Icon = ({ category }) => {
    switch (category.categoryId) {
        case 0:
            return <IconListUl />;
        case 1:
            return <IconTwitter />;
        case 2:
            return <IconGraduationCap />;
        case 3:
            return <IconGamePad />;
        case 4:
            return <IconBriefCase />;
        case 5:
            return <IconYoutube />;
        case 6:
            return <IconServer />;
        case 7:
            return <IconEllipsis />;
        default:
            return <></>;
    }
}

const IconTwitter = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('tw')}><FontAwesomeIcon icon={faTwitter} /></div>
        </div>
    </div>
)

const IconGraduationCap = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('gc')}><FontAwesomeIcon icon={faGraduationCap} /></div>
        </div>
    </div>
)

const IconGamePad = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('gp')}><FontAwesomeIcon icon={faGamepad} /></div>
        </div>
    </div>
)

const IconYoutube = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('yt')}><FontAwesomeIcon icon={faYoutube} /></div>
        </div>
    </div>
)

const IconBriefCase = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('bc')}><FontAwesomeIcon icon={faBriefcase} /></div>
        </div>
    </div>
)

const IconServer = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('sv')}><FontAwesomeIcon icon={faServer} /></div>
        </div>
    </div>
)

const IconEllipsis = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('es')}><FontAwesomeIcon icon={faEllipsisH} /></div>
        </div>
    </div>
)

const IconListUl = () => (
    <div className={cx('effect', 'jaques')}>
        <div className={cx("buttons")}>
            <div className={cx('lu')}><FontAwesomeIcon icon={faListUl} /></div>
        </div>
    </div>
)

export default Icon;