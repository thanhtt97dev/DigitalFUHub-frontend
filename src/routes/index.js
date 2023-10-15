import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';
import Home from '~/pages/Home';
import NormalLayout from '~/layouts/NormalLayout';
import UploadFile from '~/pages/UploadFile';
import Verification2FA from '~/pages/Verification2FA';
import SettingsLayout from '~/pages/User/Settings/SettingsLayout';
import Personal from '~/pages/User/Settings/Personal';
import Security from '~/pages/User/Settings/Security';
import ChatBox from '~/pages/ChatBox';
import NotFound from '~/pages/NotFound';
import Deposit from '~/pages/User/Deposit';
import SignUp from '~/pages/SignUp';
import BankAccount from '~/pages/User/Settings/BankAccount';
import SellerLayout from '~/layouts/SellerLayout';
import PrivacyPolicy from '~/pages/Policy/PrivacyPolicy';
import FAQ from '~/pages/Policy/FAQ';
import WarrantPolicy from '~/pages/Policy/WarrantPolicy';

import { CUSTOMER_ROLE, SELLER_ROLE } from '~/constants';
import ConfirmEmail from '~/pages/ConfirmEmail';
import ResetPassword from '~/pages/ResetPassword';
import AddProduct from '~/pages/Seller/ManageProduct/AddProduct';
import Coupons from '~/pages/Seller/ManageCoupon/Coupons';
import ProductDetail from '~/pages/ProductDetail';
import Cart from '~/pages/Cart';
import Products from '~/pages/Seller/ManageProduct/Products';
import EditProduct from '~/pages/Seller/ManageProduct/EditProduct';
import Orders from '~/pages/Seller/ManageOrder/Orders';
import HistoryTransactions from '~/pages/HistoryTransactions';
import RegisterSeller from '~/pages/User/Settings/RegisterSeller';
import HistoryOrder from '~/pages/HistoryOrder';

const routesConfig = [
    {
        title: 'login',
        path: '/login',
        component: <Login />,
    },
    {
        title: 'accessDenied',
        path: '/accessDenied',
        layout: <NormalLayout />,
        component: <AccessDenied />,
    },
    {
        title: 'not found',
        path: '/notFound',
        layout: <NormalLayout />,
        component: <NotFound />,
    },
    {
        title: 'home',
        path: '/home',
        layout: <NormalLayout />,
        component: <Home />,
    },
    {
        title: 'home',
        path: '/',
        layout: <NormalLayout />,
        component: <Home />,
    },
    {
        title: 'upload',
        path: '/upload',
        layout: <NormalLayout />,
        component: <UploadFile />,
    },
    {
        title: 'verification2FA',
        path: '/verification2FA/:id',
        component: <Verification2FA />,
    },
    {
        title: 'user settings',
        path: '/settings',
        layout: <NormalLayout />,
        component: <SettingsLayout><Personal /></SettingsLayout>,
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        title: 'user settings',
        path: '/settings/personal',
        layout: <NormalLayout />,
        component: <SettingsLayout><Personal /></SettingsLayout>,
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        title: 'user settings',
        path: '/settings/security',
        layout: <NormalLayout />,
        component: <SettingsLayout><Security /></SettingsLayout>,
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        title: 'user settings',
        path: '/settings/bankAccount',
        layout: <NormalLayout />,
        component: <SettingsLayout><BankAccount /></SettingsLayout>,
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        title: 'Register Seller',
        path: '/settings/registerSeller',
        layout: <NormalLayout />,
        component: <SettingsLayout><RegisterSeller /></SettingsLayout>,
        role: [CUSTOMER_ROLE],
    },
    {
        title: 'chatBox',
        path: '/chatBox',
        layout: <NormalLayout />,
        component: <ChatBox />
    },
    {
        title: 'SignUp',
        path: '/signup',
        component: <SignUp />
    },
    {
        title: 'Deposit',
        path: '/deposit',
        layout: <NormalLayout />,
        component: <Deposit />,
    },
    {
        title: 'History Transaction',
        path: '/historyTransaction',
        layout: <NormalLayout />,
        component: <HistoryTransactions />,
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        title: 'Seller statistic',
        path: '/seller',
        layout: <SellerLayout />,
        component: <></>,
        role: [SELLER_ROLE],
    },
    {
        title: 'Seller statistic',
        path: '/seller/statistic',
        layout: <SellerLayout />,
        component: <></>,
        role: [SELLER_ROLE],
    },
    {
        title: 'Coupon',
        path: '/seller/coupon/list',
        layout: <SellerLayout />,
        component: <Coupons />,
        role: [SELLER_ROLE],
    },
    {
        title: 'Seller order detail',
        path: '/seller/order/:id',
        layout: <SellerLayout />,
        component: <></>,
        role: [SELLER_ROLE],
    },
    {
        title: 'Seller All Products',
        path: '/seller/product/list',
        layout: <SellerLayout />,
        component: <Products />,
        role: [SELLER_ROLE],
    },
    {
        title: 'Seller add new product',
        path: '/seller/product/new',
        layout: <SellerLayout />,
        component: <AddProduct />,
        role: [SELLER_ROLE],
    },
    {
        title: 'Seller product detail (Edit)',
        path: '/seller/product/:productId',
        layout: <SellerLayout />,
        component: <EditProduct />,
        role: [SELLER_ROLE],
    },
    {
        title: 'Seller products banned',
        path: '/seller/product/banned',
        layout: <SellerLayout />,
        component: <></>,
        role: [SELLER_ROLE],
    },
    {
        title: 'Seller orders',
        path: '/seller/order/list',
        layout: <SellerLayout />,
        component: <Orders />,
        role: [SELLER_ROLE],
    },
    {
        title: 'History Order',
        path: '/history/order',
        layout: <NormalLayout />,
        component: <SettingsLayout><HistoryOrder /></SettingsLayout>,
        role: [SELLER_ROLE, CUSTOMER_ROLE]
    },
    {
        title: 'Confirm Email',
        path: '/confirmEmail',
        component: <ConfirmEmail />,
    },
    {
        title: 'Reset Password',
        path: '/resetPassword',
        component: <ResetPassword />,
    },
    {
        title: 'Product Detail',
        path: '/product/:id',
        layout: <NormalLayout />,
        component: <ProductDetail />,
    },
    {
        title: 'Cart',
        path: '/cart',
        layout: <NormalLayout />,
        component: <Cart />,
    },
    {
        title: 'Privacy Policy',
        path: '/privacyPolicy',
        layout: <NormalLayout />,
        component: <PrivacyPolicy />,
    },
    {
        title: 'Warrant Policy',
        path: '/warrantPolicy',
        layout: <NormalLayout />,
        component: <WarrantPolicy />,
    },
    {
        title: 'FAQ',
        path: '/faq',
        layout: <NormalLayout />,
        component: <FAQ />,
    },
];
export default routesConfig;