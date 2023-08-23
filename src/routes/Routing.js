import React, { useCallback, useEffect, useState } from 'react';
import { useIsAuthenticated, useAuthUser } from 'react-auth-kit';
import { Route, Routes } from 'react-router-dom';

import routesConfig from './index';
import NotFound from '~/pages/NotFound';
import Home from '~/pages/Home';

function Routing() {
    const auth = useAuthUser();
    const user = auth();

    const [routesCanVistit, setRoutesCanVistit] = useState([]);

    const getRoutesCanVisit = useCallback(() => {
        setRoutesCanVistit([]);
        routesConfig.forEach((route) => {
            if (route.auth === false) {
                setRoutesCanVistit((prev) => [...prev, route]);
            } else {
                if (user !== null && route.role.includes(user.roleName)) {
                    setRoutesCanVistit((prev) => [...prev, route]);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        getRoutesCanVisit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Routes>
            <Route path="/" exact element={<Home />}></Route>
            {routesCanVistit.map((route, index) => {
                return (
                    <Route key={index} path={route.path} element={route.component}>
                        {route.routes !== undefined
                            ? route.routes.map((child) => {
                                  return <Route key={child.path} path={child.path} element={child.component} />;
                              })
                            : ''}
                    </Route>
                );
            })}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Routing;
