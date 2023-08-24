import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useAuthUser, useSignIn } from 'react-auth-kit';
import { Route, Routes } from 'react-router-dom';

import routesConfig from './index';
import NotFound from '~/pages/NotFound';
import Home from '~/pages/Home';

import { getUserId, getTokenInCookies } from '~/utils';
import { getUserById } from '~/api/user';
import { NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';

function Routing() {
    const signIn = useSignIn();

    const token = getTokenInCookies();
    const userId = getUserId();

    //check user was logined
    useLayoutEffect(() => {
        ///token not expires in cookie
        if (token !== undefined && userId !== undefined) {
            getUserById(userId)
                .then((res) => {
                    signIn({
                        token: NOT_HAVE_MEANING_FOR_TOKEN,
                        expiresIn: NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES,
                        authState: {
                            id: res.data.userId,
                            email: res.data.email,
                            firstName: res.data.email,
                            roleName: res.data.roleName,
                        },
                    });
                    //saveDataAuthToCookies(userId, token, res.data.refreshToken, res.data.jwtId);
                })
                .catch((err) => {
                    console.error('User un logined');
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, token]);

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
