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
import Deposit from '~/pages/User/Deposit';
import SignUp from '~/pages/SignUp';
import BankAccount from '~/pages/User/Settings/BankAccount';
import SellerLayout from '~/layouts/SellerLayout';

import { CUSTOMER_ROLE, SELLER_ROLE } from '~/constants';
import ConfirmEmail from '~/pages/ConfirmEmail';
import ResetPassword from '~/pages/ResetPassword';

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
        title: 'Seller',
        path: '/seller',
        layout: <SellerLayout />,
        component: <></>,
    },
    {
        title: 'Dashboard Seller',
        path: '/seller/dashboard',
        layout: <SellerLayout />,
        component: <></>,
    },
    {
        title: 'Seller All Products',
        path: '/seller/product/list',
        layout: <SellerLayout />,
        component: <ConfirmEmail />,
    },
    {
        title: 'Seller add new product',
        path: '/seller/product/new',
        layout: <SellerLayout />,
        component: <></>,
    },
    {
        title: 'Seller product detail (Edit)',
        path: '/seller/product/:id',
        layout: <SellerLayout />,
        component: <></>,
    },
    {
        title: 'Seller products banned',
        path: '/seller/product/banned',
        layout: <SellerLayout />,
        component: <></>,
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
];
export default routesConfig;






// const routesConfig = [
//     {
//         title: 'login',
//         path: '/login',
//         component: <Login />,
//     },
//     {
//         title: 'accessDenied',
//         path: '/accessDenied',
//         layout: <NormalLayout />,
//         component: <AccessDenied />,
//     },
//     {
//         title: 'home',
//         path: '/home',
//         layout: <NormalLayout />,
//         component: <Home />,
//     },
//     {
//         title: 'admin',
//         path: '/admin',
//         layout: <AdminLayout />,
//         role: [ADMIN_ROLE, CUSTOMER_ROLE],
//         routes: [
//             {
//                 path: 'dashboard',
//                 component: <DashBoard />,
//             },
//             {
//                 path: 'users',
//                 component: <Users />,
//             },
//             {
//                 path: 'users/:id',
//                 component: <Detail />,
//             },
//             {
//                 path: 'notificaions',
//                 component: <Notificaion />,
//             },
//         ],
//     },
//     {
//         title: 'register',
//         path: '/register',
//         component: <Register />,
//     },
//     {
//         title: 'upload',
//         path: '/upload',
//         layout: <NormalLayout />,
//         component: <UploadFile />,
//     },
//     {
//         title: 'verification2FA',
//         path: '/verification2FA/:id',
//         component: <Verification2FA />,
//     },
//     {
//         title: 'user settings',
//         path: '/settings',
//         layout: <NormalLayout />,
//         component: <SettingsLayout />,
//         role: [CUSTOMER_ROLE],
//         routes: [
//             {
//                 path: '',
//                 component: <Personal />,
//             },
//             {
//                 path: 'security',
//                 component: <Security />,
//             },
//         ],
//     },
//     {
//         title: 'chatBox',
//         path: '/chatBox',
//         layout: <NormalLayout />,
//         component: <ChatBox />
//     },
//     {
//         title: 'signup',
//         path: '/signup',
//         layout: <NormalLayout />,
//         component: <SignUp />
//     },
//     {
//         title: 'deposit',
//         path: '/deposit',
//         layout: <NormalLayout />,
//         component: <Deposit />,
//     },
// ];