import React, { useState, useEffect, useRef } from "react";
import ProductVariantDetail from '~/components/ProductDetails/ProductVariantDetail';
import ShopInfomations from '~/components/ProductDetails/ShopInfomation';
import ProductDescription from '~/components/ProductDetails/ProductDescription';
import ProductFeedback from '~/components/ProductDetails/ProductFeedback';
import Spinning from "~/components/Spinning";
import { getProductById } from '~/api/product';
import { useNavigate, useParams } from 'react-router-dom';
import { RESPONSE_CODE_PRODUCT_ACTIVE, RESPONSE_CODE_PRODUCT_BAN, RESPONSE_CODE_PRODUCT_REMOVE, RESPONSE_CODE_PRODUCT_HIDE, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';

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
            <ProductVariantDetail
                productVariants={productVariants}
                handleSelectProductVariant={handleSelectProductVariant}
                productVariantsSelected={productVariantsSelected}
                product={product}
                scrollToStartFeedback={scrollToStartFeedback} />
            <ShopInfomations product={product} />
            <ProductDescription product={product} />
            <div ref={feedbackStartRef} />
<<<<<<< HEAD
            {product !== null && product.numberFeedback > 0 ?
                <ProductFeedback product={product} />
                :
                <></>
            }

        </>
=======
            <ProductFeedback product={product} />
        </Spinning>
>>>>>>> efc286476260aa80c2c066c6dbb2a069d711b0fb
    )
}

export default ProductDetail;

