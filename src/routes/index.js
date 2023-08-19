import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';

import Dashboard from '~/pages/Dashboard';
import Home from '~/pages/Home';

import { ADMIN_ROLE } from '~/constants';

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
        routes: [],
    },
    {
        title: 'dashboard',
        path: '/dashboard',
        component: <Dashboard />,
        auth: true,
        role: [ADMIN_ROLE],
        routes: [],
    },
];

export default routesConfig;
