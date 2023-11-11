import React, { useEffect, useState, useContext } from "react";
import classNames from 'classnames/bind';
import ModalConfirmation from "~/components/Modals/ModalConfirmation";
import styles from '~/pages/User/Settings/WishList/WishList.module.scss';
import { useAuthUser } from 'react-auth-kit';
import { RESPONSE_CODE_SUCCESS, PRODUCT_BAN } from '~/constants';
import { formatPrice, discountPrice } from '~/utils';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { Card, Typography, Space, Image, Button, Checkbox } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { getWishListByUserId, removeWishList, removeWishListSelecteds } from '~/api/wishList';

///
const { Title, Text } = Typography;
const cx = classNames.bind(styles);
///


const RangeOriginPriceProductVariant = ({ productVariants }) => {
    const priceProductVariant = productVariants.map(x => x.price);
    const minPrice = Math.min(...priceProductVariant);
    const maxPrice = Math.max(...priceProductVariant);

    return <Text delete strong type="secondary">{formatPrice(minPrice)} - {formatPrice(maxPrice)}</Text>
}

const RangeDiscountPriceProductVariant = ({ productVariants, discount }) => {
    const priceProductVariant = productVariants.map(x => x.price);
    const minPrice = discountPrice(Math.min(...priceProductVariant), discount);
    const maxPrice = discountPrice(Math.max(...priceProductVariant), discount);

    return <Text strong>{formatPrice(minPrice)} - {formatPrice(maxPrice)}</Text>
}

const WishList = () => {
    /// states
    const [products, setProducts] = useState([]);
    const [reloadProductsFlag, setReloadProductsFlag] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isOpenModalConfirmationDelete, setIsOpenModalConfirmationDelete] = useState(false);
    const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false);
    const [productIdSlecteds, setProductIdSlecteds] = useState([]);
    ///

    /// contexts
    const notification = useContext(NotificationContext)
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// router
    const navigate = useNavigate();
    ///

    /// useEffects
    useEffect(() => {
        if (user === undefined || user === null) return;
        getWishListByUserId(user.id)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setProducts(result);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadProductsFlag]);
    ///


    /// handles
    const handleRemoveWishList = (productId) => {
        if (user === undefined || user === null) return;
        const dataRequestRemove = {
            userId: user.id,
            productId: productId
        }

        removeWishList(dataRequestRemove)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        reloadProducts();
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleChangeCheckbox = (values) => {
        setProductIdSlecteds(values);
    }

    const handleClickEdit = () => {
        setIsEdit(true);
    }

    const handleClickComplete = () => {
        if (productIdSlecteds) setProductIdSlecteds([]);
        setIsEdit(false);
    }

    const handleAddProductToCart = (productId) => {
        navigate(`/product/${productId}`);
    }

    const handleOkConfirmationDeleteSelecteds = () => {
        if (user === undefined || user === null) return;

        // data request delete
        const request = {
            userId: user.id,
            productIds: productIdSlecteds
        }

        // remove
        removeWishListSelecteds(request)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        notification("success", "Xóa sản phẩm yêu thích thành công");

                        // reload
                        reloadProducts();

                        // reset product id selecteds
                        reloadButtonAndState();
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                handleCloseConfirmationDeleteSelecteds();
            })
    }

    const handleCloseConfirmationDeleteSelecteds = () => {
        setIsOpenModalConfirmationDelete(false);
    }

    const handleOpenConfirmationDeleteSelecteds = () => {
        setIsOpenModalConfirmationDelete(true);
    }
    ///


    /// functions
    const reloadProducts = () => {
        setReloadProductsFlag(!reloadProductsFlag);
    }

    const reloadButtonAndState = () => {
        setIsEdit(false);
        setProductIdSlecteds([]);
    }
    ///

    /// styles
    const styleImage = { width: '32vh', height: '32vh', borderRadius: 7 }
    const styleCardItem = {
        minWidth: '35vh',
        minHeight: '60vh',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
    }
    const styleContainerImage = { width: '100%', textAlign: 'center' }
    const styleContainer = { width: '100%', minHeight: '100vh' }
    const disableCardStyle = { padding: 10, opacity: 0.4, pointerEvents: 'none' };
    const unDisableCardStyle = { opacity: 1, pointerEvents: 'auto' };
    const paddingCartBodyStyle = { padding: 10 }
    ///

    return (
        <Card title="Danh sách các sản phẩm yêu thích" style={styleContainer}
            extra={<>
                {products.length > 0 && (isEdit ? <Button type="link" onClick={handleClickComplete}><Text type="success">Hoàn tất</Text></Button>
                    : <Button type="link" danger onClick={handleClickEdit}>Chỉnh sửa</Button>)}

                {productIdSlecteds.length > 0 ? <><Button danger icon={<DeleteOutlined />} onClick={handleOpenConfirmationDeleteSelecteds}>Xóa ({productIdSlecteds.length})</Button></>
                    : <></>}

            </>}>
            <Checkbox.Group onChange={handleChangeCheckbox} value={productIdSlecteds} >
                {
                    <Space size={[10, 16]} wrap>
                        {products.map((product, index) => (
                            <Card key={index} style={styleCardItem} bodyStyle={product.productStatusId === PRODUCT_BAN ? disableCardStyle : paddingCartBodyStyle}>
                                <div style={styleContainerImage} className={cx('margin-bottom')}>
                                    <Image style={styleImage} src={product.thumbnail} />
                                    {
                                        product.productStatusId === PRODUCT_BAN ? <div className={cx('circle')}> Sản phẩm này đã bị BAN</div> : <></>
                                    }
                                </div>
                                <Link to={'/product/' + product.productId} className={cx('flex-item-center')}><Title level={4}>{product.productName}</Title></Link>
                                <Space align="center" className={cx('flex-item-center', 'margin-bottom')}>
                                    {product.productVariants.length > 1 ? (<RangeOriginPriceProductVariant productVariants={product.productVariants} />)
                                        : (product.productVariants.length === 1 ? <Text delete strong type="secondary">{formatPrice(product.productVariants[0].price)}</Text> : <></>)}
                                    <div className={cx('red-box')}><p className={cx('text-discount')}>-{product.discount}%</p></div>
                                </Space>
                                <div className={cx('flex-item-center', 'margin-bottom')}>
                                    {product.productVariants.length > 1 ? (<RangeDiscountPriceProductVariant productVariants={product.productVariants} discount={product.discount} />)
                                        : (product.productVariants.length === 1 ? <Text strong>{formatPrice(discountPrice(product.productVariants[0].price, product.discount))}</Text> : <></>)}
                                </div>

                                {isEdit ? (<div className={cx('flex-item-center')} style={unDisableCardStyle}><Checkbox value={product.productId} /></div>) : (
                                    <Space style={unDisableCardStyle} align="center" size={30} className={cx('flex-item-center', 'margin-bottom')}>
                                        <Button type="primary" shape="circle" icon={<ShoppingCartOutlined />} onClick={() => handleAddProductToCart(product.productId)} />
                                        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleRemoveWishList(product.productId)} />
                                    </Space>
                                )}

                            </Card>
                        ))}
                    </Space>
                }
            </Checkbox.Group>

            <ModalConfirmation title='Xóa sản phẩm yêu thích'
                isOpen={isOpenModalConfirmationDelete}
                onOk={handleOkConfirmationDeleteSelecteds}
                onCancel={handleCloseConfirmationDeleteSelecteds}
                contentModal={`Bạn có muốn xóa ${productIdSlecteds.length} sản phẩm không?`}
                contentButtonCancel='Không'
                contentButtonOk='Đồng ý' />
        </Card>
    )
}

export default WishList;


