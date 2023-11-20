import React, { useState, useEffect } from "react";
import { Button } from 'antd';
import { getAllCategory } from "~/api/category";
import { AlignLeftOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from '~/pages/Home/Home.module.scss';
import { RESPONSE_CODE_SUCCESS } from '~/constants';

const cx = classNames.bind(styles);

/// styles
const styleCategorySelected = {
    alignItems: 'flex-start',
    color: '#ee4d2d',
    fontSize: '14px',
    fontWeight: 700,
    gridArea: 'auto',
    lineHeight: '16px',
};
///

const Categories = ({ searchParam, setSearchParam }) => {
    /// states
    const [categories, setCategories] = useState([]);
    ///

    /// handles
    const handleSelectCategory = (categoryId) => {
        // new param search
        const newParamSearch = {
            ...searchParam,
            categoryId: categoryId
        }

        setSearchParam(newParamSearch);
    }
    ///

    /// useEffects
    useEffect(() => {
        getAllCategory()
            .then(res => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setCategories(data.result);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    ///

    return (
        <div className={cx("grid1")}>
            <li><div><AlignLeftOutlined /> Danh mục sản phẩm</div></li>
            <li><Button type="text" block style={searchParam.categoryId === 0 ? styleCategorySelected : {}} onClick={() => handleSelectCategory(0)}>Tất cả</Button></li>
            {
                categories.map((category, index) => (
                    <li key={index}>
                        <Button type="text" block onClick={() => handleSelectCategory(category.categoryId)}>
                            <p style={searchParam.categoryId === category.categoryId ? styleCategorySelected : {}}>{category.categoryName}</p>
                        </Button>
                    </li>))
            }
        </div>
    )
}

export default Categories;