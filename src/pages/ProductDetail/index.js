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
                    const data = response.data;
                    if (!data) {
                        navigate('/notFound');
                    }
                    setProduct(data)
                    console.log('data: ' + JSON.stringify(data))
                    setProductVariants([...response.data.productVariants])
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

