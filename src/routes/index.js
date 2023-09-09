import Login from '~/pages/Login';
import Register from '~/pages/Register';
import AccessDenied from '~/pages/AccessDenied';

import Home from '~/pages/Home';

import { ADMIN_ROLE, User_ROLE } from '~/constants';
import AdminLayout from '~/components/AdminLayout';
import DashBoard from '~/pages/Admin/DashBoard';
import Users from '~/pages/Admin/Users';
import Detail from '~/pages/Admin/Users/Detail';
import Notificaion from '~/pages/Admin/Notificaion';
import NormalLayout from '~/components/NormalLayout';
import UploadFile from '~/components/UploadFile';

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
        title: 'admin',
        path: '/admin',
        component: <AdminLayout />,
        role: [ADMIN_ROLE, User_ROLE],
        routes: [
            {
                path: 'dashboard',
                component: <DashBoard />,
            },
            {
                path: 'users',
                component: <Users />,
            },
            {
                path: 'users/:id',
                component: <Detail />,
            },
            {
                path: 'notificaions',
                component: <Notificaion />,
            },
        ],
    },
    {
        title: 'register',
        path: '/register',
        component: <Register />,
    },
    {
        title: 'upload',
        path: '/upload',
        role: [ADMIN_ROLE, User_ROLE],
        layout: <NormalLayout />,
        component: <UploadFile />,
    },
];

export default routesConfig;
