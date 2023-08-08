import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';

import Dashboard from '~/pages/Dashboard';

import { ANONYMOUS_ROLE, ADMIN_ROLE } from '~/constants';

const routesConfig = [
    {
        title: 'login',
        path: '/login',
        exact: false,
        component: <Login />,
        auth: false,
        role: [ANONYMOUS_ROLE],
        routes: [],
    },
    {
        title: 'accessDenied',
        path: '/accessDenied',
        exact: false,
        component: <AccessDenied />,
        auth: false,
        role: [ANONYMOUS_ROLE],
        routes: [],
    },
    {
        title: 'dashboard',
        path: '/dashboard',
        exact: false,
        component: <Dashboard />,
        auth: true,
        role: [ADMIN_ROLE],
        routes: [],
    },
];

export default routesConfig;
