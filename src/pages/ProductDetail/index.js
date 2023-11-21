import React, { useState, useEffect, useRef } from "react";
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import styles from './ProductDetail.module.scss';
import ShopInfomations from '~/components/ProductDetails/ShopInfomation';
import ProductFeedback from '~/components/ProductDetails/ProductFeedback';
import ProductDescription from '~/components/ProductDetails/ProductDescription';
import ProductVariantDetail from '~/components/ProductDetails/ProductVariantDetail';
import { getProductById } from '~/api/product';
import { useNavigate, useParams } from 'react-router-dom';
import { RESPONSE_CODE_PRODUCT_ACTIVE, RESPONSE_CODE_PRODUCT_BAN, RESPONSE_CODE_PRODUCT_REMOVE, RESPONSE_CODE_PRODUCT_HIDE, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';

///
const cx = classNames.bind(styles);
///

const ProductDetail = () => {

    /// states
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productVariants, setProductVariants] = useState([]);
    const [productVariantsSelected, setProductVariantsSelected] = useState(null);
    const [isLoadingInfoProduct, setIsLoadingInfoProduct] = useState(true);
    const navigate = useNavigate()
    ///


    /// refs
    const feedbackStartRef = useRef(null);
    ///

    /// variables
    const initialProductId = id;
    ///


    /// handles

    const handleSelectProductVariant = (item) => {
        if (productVariantsSelected === item) {
            setProductVariantsSelected(null)
        } else {
            setProductVariantsSelected(item)
        }
    }

    const scrollToStartFeedback = () => {
        feedbackStartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    ///



    /// useEffects
    useEffect(() => {
        const getDetailProduct = () => {
            getProductById(initialProductId)
                .then((response) => {
                    if (response.status === 200) {
                        const data = response.data;
                        // status of response
                        const status = data.status;
                        const responseCode = status.responseCode;
                        if (responseCode === RESPONSE_CODE_PRODUCT_REMOVE
                            ||
                            responseCode === RESPONSE_CODE_PRODUCT_HIDE
                            ||
                            responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                            navigate('/notFound');
                        } else if (responseCode === RESPONSE_CODE_PRODUCT_ACTIVE || responseCode === RESPONSE_CODE_PRODUCT_BAN) {
                            // result of response
                            const result = data.result;
                            setProduct(result)
                            setProductVariants([...result.productVariants])
                        }
                        setIsLoadingInfoProduct(false);
                    }
                })
                .catch((errors) => {
                    console.log(errors)
                })

        }

        getDetailProduct();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    ///

    return (
        <Spinning spinning={isLoadingInfoProduct}>
            <div className={cx('container')}>
                <ProductVariantDetail
                    productVariants={productVariants}
                    handleSelectProductVariant={handleSelectProductVariant}
                    productVariantsSelected={productVariantsSelected}
                    product={product}
                    scrollToStartFeedback={scrollToStartFeedback} />
                <ShopInfomations product={product} />
                <ProductDescription product={product} />
                <div ref={feedbackStartRef} />
                {product !== null && product.numberFeedback > 0 ?
                    <ProductFeedback product={product} />
                    :
                    <></>
                }
            </div>
        </Spinning>
    )
}

export default ProductDetail;

