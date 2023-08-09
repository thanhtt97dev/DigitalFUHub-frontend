import { createRefresh } from 'react-auth-kit';

import { apiPost } from '~/api/defaultApi';
import { getRefreshToken, getToken, saveDataAuthToCookies } from '~/utils';

const refreshToken = createRefresh({
    interval: 9, // Refreshs the token in every 10 minutes
    refreshApiCallback: async (param) => {
        const data = {
            refreshToken: getRefreshToken(),
            AccessToken: getToken(),
        };

        apiPost('api/users/refreshToken', data)
            .then((res) => {
                if (res.status === 200) {
                    saveDataAuthToCookies(res.data.accessToken, res.data.refreshToken, res.data.jwtId);
                    return {
                        isSuccess: true,
                        newAuthToken: res.data.accessToken,
                        newAuthTokenExpireIn: 10,
                        newRefreshTokenExpiresIn: 10,
                    };
                } else if (res.status === 409) {
                    console.log(res);
                } else {
                    console.log(res);
                }
            })
            .catch((err) => {
                console.log(err.message);
                return {
                    isSuccess: false,
                };
            });
    },
});

export default refreshToken;
