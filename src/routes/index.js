import Login from '~/pages/Login';
import Register from '~/pages/Register';
import AccessDenied from '~/pages/AccessDenied';

import Home from '~/pages/Home';

import { ADMIN_ROLE, CUSTOMER_ROLE } from '~/constants';
import AdminLayout from '~/components/AdminLayout';
import DashBoard from '~/pages/Admin/DashBoard';
import Users from '~/pages/Admin/Users';
import Detail from '~/pages/Admin/Users/Detail';
import Notificaion from '~/pages/Admin/Notificaion';
import NormalLayout from '~/components/NormalLayout';
import UploadFile from '~/pages/UploadFile';
import Verification2FA from '~/pages/Verification2FA';
import SettingsLayout from '~/pages/User/Settings/SettingsLayout';
import Personal from '~/pages/User/Settings/Personal';
import Security from '~/pages/User/Settings/Security';
import ChatBox from '~/pages/ChatBox';
import Deposit from '~/pages/User/Deposit';
import SignUp from '~/pages/SignUp';

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
        title: 'admin',
        path: '/admin/dashboard',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE, CUSTOMER_ROLE],
        component: <DashBoard />,
    },
    {
        title: 'admin',
        path: '/admin/users',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE, CUSTOMER_ROLE],
        component: <Users />,

    },
    {
        title: 'admin',
        path: '/admin/users/:id',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE, CUSTOMER_ROLE],
        component: <Detail />
    },
    {
        title: 'admin',
        path: '/admin/notificaions',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE, CUSTOMER_ROLE],
        component: <Notificaion />,
    },
    {
        title: 'register',
        path: '/register',
        component: <Register />,
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
        role: [CUSTOMER_ROLE],
    },
    {
        title: 'user settings',
        path: '/settings/security',
        layout: <NormalLayout />,
        component: <SettingsLayout><Security /></SettingsLayout>,
        role: [CUSTOMER_ROLE],
    },
    {
        title: 'chatBox',
        path: '/chatBox',
        layout: <NormalLayout />,
        component: <ChatBox />
    },
    {
        title: 'signup',
        path: '/signup',
        layout: <NormalLayout />,
        component: <SignUp />
    },
    {
        title: 'deposit',
        path: '/deposit',
        layout: <NormalLayout />,
        component: <Deposit />,
    },
];
export default routesConfig;
