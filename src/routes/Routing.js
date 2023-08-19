/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { useIsAuthenticated, useAuthUser } from 'react-auth-kit';
import { Route, Routes } from 'react-router-dom';

import routesConfig from './index';
import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import Dashboard from '~/pages/Dashboard';

function Routing() {
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    const user = auth();

    const [routesCanVistis, setRoutesCanVistis] = useState([]);

    const getRoutesCanVistisForUser = useCallback(() => {
        setRoutesCanVistis([]);
        routesConfig.map((route) => {
            if (route.auth === false) {
                setRoutesCanVistis((prev) => [...prev, route]);
            } else {
                if (isAuthenticated() && user !== null && route.role.includes(user.roleName)) {
                    setRoutesCanVistis((prev) => [...prev, route]);
                }
            }
        });
    }, []);

    useEffect(() => {
        getRoutesCanVistisForUser();
    }, []);

    const getStartUpPage = useCallback(() => {
        if (isAuthenticated()) {
            return <Dashboard />;
        } else {
            return <Login />;
        }
    }, [user]);

    return (
        <Routes>
            <Route path="/" exact element={getStartUpPage()}></Route>
            {routesCanVistis.map((route, index) => {
                return <Route key={index} path={route.path} element={route.component} />;
            })}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Routing;
