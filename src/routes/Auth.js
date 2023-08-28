import { useLayoutEffect } from 'react';
import { useSignIn } from 'react-auth-kit';

import { getUserId, getTokenInCookies, removeUserInfoInCookie } from '~/utils';
import { getUserById } from '~/api/user';
import { NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';

function Auth(props) {
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
                    removeUserInfoInCookie();
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, token]);

    return props.children;
}

export default Auth;
