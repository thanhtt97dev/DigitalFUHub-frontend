import { useLayoutEffect, useEffect, useState } from 'react';
import { useSignIn } from 'react-auth-kit';

import { getUserId, getTokenInCookies, removeUserInfoInCookie } from '~/utils';
import { getUserByIdForAuth } from '~/api/user';
import { ADMIN_ROLE, NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';
import Spinning from '~/components/Spinning';

// import Spinning from "~/components/Spinning"
// import { Spin } from 'antd';

function Auth(props) {
    const signIn = useSignIn();

    const token = getTokenInCookies();
    const userId = getUserId();

    const [loading, setLoading] = useState(false);

    //check user was logined
    useLayoutEffect(() => {
        setLoading(true);
        ///token not expires in cookie
        if (token !== undefined && userId !== undefined) {
            getUserByIdForAuth(userId)
                .then((res) => {
                    signIn({
                        token: NOT_HAVE_MEANING_FOR_TOKEN,
                        expiresIn: NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES,
                        authState: {
                            id: res.data.userId,
                            username: res.data.username,
                            email: res.data.email,
                            fullname: res.data.fullname,
                            avatar: res.data.avatar,
                            roleName: res.data.roleName,
                            twoFactorAuthentication: res.data.twoFactorAuthentication,
                            signInGoogle: res.data.signInGoogle,
                        },
                    });
                    //rule: this FE just for customer, seller
                    if (res.data.roleName === ADMIN_ROLE) {
                        removeUserInfoInCookie()
                    }
                })
                .catch((err) => {
                    removeUserInfoInCookie();
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                });
        } else {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, token]);


    //check user sign-in or sign-out in other windown(tab)
    useEffect(() => {
        const interval = setInterval(() => {
            const newToken = getTokenInCookies();
            if (newToken !== token) {
                window.location.reload();
            }
        }, 1000)

        return () => clearInterval(interval);

    }, [token])

    return (
        <>
            <Spinning spinning={loading}>
                {props.children}
            </Spinning>
        </>
    )
}

export default Auth;
