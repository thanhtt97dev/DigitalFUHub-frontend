import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';

import Home from '~/pages/Home';

import { ADMIN_ROLE, User_ROLE } from '~/constants';
import AdminLayout from '~/components/AdminLayout';
import DashBoard from '~/pages/Admin/DashBoard';
import Users from '~/pages/Admin/Users';
import Detail from '~/pages/Admin/Users/Detail';
import Notificaion from '~/pages/Admin/Notificaion';
import NormalLayout from '~/components/NormalLayout';

const routesConfig = [
    {
        title: 'login',
        path: '/login',
        component: <Login />,
        auth: false,
    },
    {
        title: 'accessDenied',
        path: '/accessDenied',
        layout: <NormalLayout />,
        component: <AccessDenied />,
        auth: false,
    },
    {
        title: 'home',
        path: '/home',
        layout: <NormalLayout />,
        component: <Home />,
        auth: false,
    },
    {
        title: 'admin',
        path: '/admin',
        component: <AdminLayout />,
        auth: true,
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
];

export default routesConfig;
