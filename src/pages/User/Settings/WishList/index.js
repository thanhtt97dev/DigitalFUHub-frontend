import React, { useEffect, useState, useContext } from "react";
import classNames from 'classnames/bind';
import ModalConfirmation from "~/components/Modals/ModalConfirmation";
import styles from '~/pages/User/Settings/WishList/WishList.module.scss';
import Spinning from "~/components/Spinning";
import { useAuthUser } from 'react-auth-kit';
import { RESPONSE_CODE_SUCCESS, PRODUCT_BAN, PAGE_SIZE_PRODUCT_WISH_LIST } from '~/constants';
import { formatPrice, discountPrice } from '~/utils';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { Card, Typography, Space, Row, Pagination, Button, Checkbox } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllWishList, removeWishList, removeWishListSelecteds } from '~/api/wishList';

///
const { Text } = Typography;
const cx = classNames.bind(styles);
///

/// styles
const styleImage = { width: '100%', height: 192 }
const styleProductName = { fontSize: 12, color: '#000000', cursor: 'pointer' };
const styleSpaceContainerProductItem = { padding: 8, height: 124, width: '100%' };
const styleContainerImage = { width: '100%', height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const styleContainer = { width: '100%', minHeight: '70vh' };
const unDisableCardStyle = { opacity: 1, pointerEvents: 'auto' };
const opacityDisabledStyle = { opacity: 0.5 };
const styleOriginPrice = { fontSize: 14 };
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1rem', marginTop: 25 };
///


const WishList = () => {
    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [reloadProductsFlag, setReloadProductsFlag] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0);
    const [requestParam, setRequestParam] = useState({
        userId: user ? user.id : 0,
        page: 1
    });
    const [isOpenModalConfirmationDelete, setIsOpenModalConfirmationDelete] = useState(false);
    const [productIdSlecteds, setProductIdSlecteds] = useState([]);
    ///

    /// contexts
    const notification = useContext(NotificationContext)
    ///

    /// router
    const navigate = useNavigate();
    ///

    /// useEffects
    useEffect(() => {

        setIsLoadingProducts(true);

        getAllWishList(requestParam)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;

                        setProducts(result.products);
                        setTotalProducts(result.totalProduct);
                        setIsLoadingProducts(false);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadProductsFlag, requestParam]);

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

    const handleClickToProduct = (productId) => {
        return navigate(`/product/${productId}`);
    }

    const handleChangePage = (page) => {

        // new param search
        const newRequestParam = {
            ...requestParam,
            page: page
        }

        setRequestParam(newRequestParam);
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

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            const allProductIds = products.map(x => x.productId)
            setProductIdSlecteds(allProductIds);
        } else {
            setProductIdSlecteds([]);
        }
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

    // checkbox all item
    const checkAll = productIdSlecteds.length === products.length;
    const indeterminateCheckAll = productIdSlecteds.length > 0 && productIdSlecteds.length < products.length;
    //

    return (
        <Spinning spinning={isLoadingProducts}>
            <div className={cx('container')}>
                <Card title={<Space size={20} align="center">{isEdit ? <Checkbox onChange={handleCheckAll} indeterminate={indeterminateCheckAll} checked={checkAll}></Checkbox> : <></>}<p>Danh sách các sản phẩm yêu thích</p></Space>} style={styleContainer}
                    bodyStyle={{ padding: 15 }}
                    extra={<>
                        {products.length > 0 && (isEdit ? <Button type="link" onClick={handleClickComplete}><Text type="success">Hoàn tất</Text></Button>
                            : <Button type="link" danger onClick={handleClickEdit}>Chỉnh sửa</Button>)}

                        {productIdSlecteds.length > 0 ? <><Button danger icon={<DeleteOutlined />} onClick={handleOpenConfirmationDeleteSelecteds}>Xóa ({productIdSlecteds.length})</Button></>
                            : <></>}

                    </>}>
                    <Checkbox.Group onChange={handleChangeCheckbox} value={productIdSlecteds} >
                        {
                            <Space size={[7, 10]} wrap>
                                {products.map((product, index) => (
                                    <div
                                        style={product.quantityProductRemaining === 0 || product.productStatusId === PRODUCT_BAN ? opacityDisabledStyle : {}}
                                        key={index}
                                        className={cx('item-product')}
                                    // onClick={() => handleClickToProduct(product.productId)}
                                    >
                                        <div style={styleContainerImage}>
                                            {
                                                product.productStatusId === PRODUCT_BAN ?
                                                    <div className={cx('circle')}> Sản phẩm này đã bị ẩn</div>
                                                    : product.quantityProductRemaining === 0 ? <div className={cx('circle')}>Hết hàng</div> : <></>
                                            }
                                            <img style={styleImage} src={product.thumbnail} alt="product" />
                                        </div>
                                        <Space direction="vertical" style={styleSpaceContainerProductItem}>
                                            <p onClick={() => handleClickToProduct(product.productId)} style={styleProductName}>{product.productName}</p>
                                            {
                                                product.productVariant?.discount !== 0 ? (<>
                                                    <div className={cx('discount-style')}><p style={{ fontSize: 10 }}>{product.productVariant.discount}% giảm</p></div>
                                                    <Space align="center">
                                                        <Text delete strong type="secondary" style={styleOriginPrice}>{formatPrice(product.productVariant.price)}</Text>
                                                        <Text style={styleDiscountPrice}>{formatPrice(discountPrice(product.productVariant.price, product.productVariant.discount))}</Text>
                                                    </Space>
                                                </>
                                                ) : (<p level={4} style={styleDiscountPrice}>{formatPrice(product.productVariant.price)}</p>)
                                            }

                                            {isEdit ? (<div className={cx('flex-item-center')} style={unDisableCardStyle}><Checkbox key={product.productId} value={product.productId} /></div>) : (
                                                <Space style={unDisableCardStyle} align="center" size={30} className={cx('flex-item-center', 'margin-bottom')}>
                                                    <Button type="primary" shape="circle" icon={<ShoppingCartOutlined />} onClick={() => handleAddProductToCart(product.productId)} />
                                                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleRemoveWishList(product.productId)} />
                                                </Space>
                                            )}

                                        </Space>

                                    </div>
                                ))}
                            </Space>

                        }

                    </Checkbox.Group>
                    {
                        products.length > 0 ?
                            <Row className={cx('flex-item-center', 'margin-top-40')}>
                                <Pagination current={requestParam.page} defaultCurrent={1} total={totalProducts} pageSize={PAGE_SIZE_PRODUCT_WISH_LIST} onChange={handleChangePage} />
                            </Row> : <></>
                    }
                    <ModalConfirmation title='Xóa sản phẩm yêu thích'
                        isOpen={isOpenModalConfirmationDelete}
                        onOk={handleOkConfirmationDeleteSelecteds}
                        onCancel={handleCloseConfirmationDeleteSelecteds}
                        contentModal={`Bạn có muốn xóa ${productIdSlecteds.length} sản phẩm không?`}
                        contentButtonCancel='Không'
                        contentButtonOk='Đồng ý' />
                </Card>
            </div>
        </Spinning>
    )
}

export default WishList;


