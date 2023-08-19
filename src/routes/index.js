import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';

import Home from '~/pages/Home';

import { ADMIN_ROLE } from '~/constants';
import AdminLayout from '~/pages/Admin/AdminLayout';
import DashBoard from '~/pages/Admin/DashBoard';
import Users from '~/pages/Admin/Users';

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
        component: <AccessDenied />,
        auth: false,
    },
    {
        title: 'home',
        path: '/home',
        component: <Home />,
        auth: true,
        role: [ADMIN_ROLE],
    },
    {
        title: 'admin',
        path: '/admin',
        component: <AdminLayout />,
        auth: true,
        role: [ADMIN_ROLE],
        routes: [
            {
                path: 'dashboard',
                component: <DashBoard />,
            },
            {
                path: 'users',
                component: <Users />,
            },
        ],
    },
];

export default routesConfig;
