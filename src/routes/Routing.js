/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { useIsAuthenticated, useAuthUser } from 'react-auth-kit';
import { Route, Routes } from 'react-router-dom';

import routesConfig from './index';

function Routing() {
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    const user = auth();

    let routesProtected = [];
    let routesUnProtected = [];

    const getRoutesCanVistisForUser = useCallback(() => {
        routesConfig.map((route) => {
            if (route.auth === false) {
                routesUnProtected.push(route.title);
            } else {
                if (isAuthenticated() && user !== null) {
                    if (route.role.includes(user.roleName)) {
                        routesProtected.push(route.title);
                    }
                }
            }
        });
    }, [user]);

    getRoutesCanVistisForUser();

    return (
        <Routes>
            {routesConfig.map((route, index) => {
                if (routesUnProtected.includes(route.title)) {
                    return <Route key={index} path={route.path} exact={route.exact} element={route.component} />;
                }
                if (routesProtected.includes(route.title)) {
                    return <Route key={index} path={route.path} exact={route.exact} element={route.component} />;
                }
            })}
            <Route
                path="*"
                element={
                    <div>
                        <h2>404 Page not found</h2>
                    </div>
                }
            />
        </Routes>
    );
}

export default Routing;
