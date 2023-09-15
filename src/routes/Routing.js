import React, { useCallback, useLayoutEffect, useState, Fragment } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Outlet, Route, Routes } from 'react-router-dom';

import routesConfig from './index';
import NotFound from '~/pages/NotFound';
import Home from '~/pages/Home';
import NormalLayout from '~/components/NormalLayout';

function Routing() {
    const auth = useAuthUser();
    const user = auth();

    const [routesCanVistit, setRoutesCanVistit] = useState([]);

    const getRoutesCanVisit = useCallback(() => {
        setRoutesCanVistit([]);
        routesConfig.forEach((route) => {
            if (route.role === undefined) {
                setRoutesCanVistit((prev) => [...prev, route]);
            } else {
                if (user !== null && route.role.includes(user.roleName)) {
                    setRoutesCanVistit((prev) => [...prev, route]);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useLayoutEffect(() => {
        getRoutesCanVisit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <>
            <Routes>
                {routesCanVistit.map((route, index) => {
                    return (
                        <Route key={index} path={route.path} element={route.layout ? route.layout : <Outlet />}>
                            <Route key={route.path} path="" element={route.component} />
                        </Route>
                    )
                })}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>

    );
}

export default Routing;

// <>
//     <Routes>
//         <Route path="/" exact element={<NormalLayout><Home /></NormalLayout>} />
//         {routesCanVistit.map((route, index) => {
//             return (
//                 <Route key={index} element={route.layout === undefined ? <Outlet /> : route.layout}>
//                     <Route key={route.path} path={route.path} element={route.component}>
//                         {route.routes !== undefined
//                             ? route.routes.map((child) => {
//                                 return (
//                                     <Route key={child.path} path={child.path} element={child.component} />
//                                 );
//                             })
//                             : ''}
//                     </Route>
//                 </Route>
//             );
//         })}
//         <Route path="*" element={<NotFound />} />
//     </Routes>
// </>