import React, { useState, useEffect } from "react";
import ProductVariantDetail from '~/components/ProductDetails/ProductVariantDetail';
import ShopInfomations from '~/components/ProductDetails/ShopInfomation';
import ProductDescription from '~/components/ProductDetails/ProductDescription';
import ProductFeedback from '~/components/ProductDetails/ProductFeedback';
import { getProductById } from '~/api/product';
import { useAuthUser } from 'react-auth-kit';
import { getFeedbackByProductId } from '~/api/feedback';
import { useNavigate, useParams } from 'react-router-dom';
import { notification } from 'antd';
import { RESPONSE_CODE_PRODUCT_ACTIVE, RESPONSE_CODE_PRODUCT_BAN, RESPONSE_CODE_PRODUCT_REMOVE, RESPONSE_CODE_PRODUCT_HIDE } from '~/constants';

const ProductDetail = () => {

    /// states
    const { id } = useParams();
    const [product, setProduct] = useState(null)
    const [productVariants, setProductVariants] = useState([])
    const [productVariantsSelected, setProductVariantsSelected] = useState(null)
    const [feedback, setFeedback] = useState([])
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate()
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    const userId = user.id;
    const initialProductId = id;
    ///


    /// handles
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const handleSelectProductVariant = (item) => {
        if (productVariantsSelected === item) {
            setProductVariantsSelected(null)
        } else {
            setProductVariantsSelected(item)
        }
    }
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
                        if (status.responseCode === RESPONSE_CODE_PRODUCT_REMOVE) {
                            navigate('/notFound');
                        }

                        // result of response
                        const result = data.result;
                        if (Object.keys(result).length === 0) {
                            navigate('/notFound');
                        }
                        setProduct(result)
                        setProductVariants([...result.productVariants])
                    }
                })
                .catch((errors) => {
                    console.log(errors)
                })
        }

        getDetailProduct();

        const getFeedbacks = () => {
            getFeedbackByProductId(initialProductId)
                .then((res) => {
                    setFeedback(res.data)
                })
                .catch((errors) => {
                    console.log(errors)
                })
        }

        getFeedbacks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    ///

    return (
        <>
            {contextHolder}
            <ProductVariantDetail
                productVariants={productVariants}
                handleSelectProductVariant={handleSelectProductVariant}
                productVariantsSelected={productVariantsSelected}
                product={product}
                openNotification={openNotification}
                userId={userId} />
            <ShopInfomations product={product} userId={userId} />
            <ProductDescription product={product} />
            <ProductFeedback feedback={feedback}
                product={product} />
        </>
    )
}

export default ProductDetail;

