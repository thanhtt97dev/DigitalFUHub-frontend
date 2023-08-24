import { createRefresh } from 'react-auth-kit';

import { apiPostAuth } from '~/api/defaultApi';
import { getRefreshTokenInCookies, getTokenInCookies, saveDataAuthToCookies } from '~/utils';

const refreshToken = createRefresh({
    interval: 10, // Refreshs the token in every 10 minutes
    refreshApiCallback: async (param) => {
        const data = {
            refreshToken: getRefreshTokenInCookies(),
            AccessToken: getTokenInCookies(),
        };

        apiPostAuth('api/users/refreshToken', data)
            .then((res) => {
                saveDataAuthToCookies(res.data.accessToken, res.data.refreshToken, res.data.jwtId);
                return {
                    isSuccess: true,
                    newAuthToken: res.data.accessToken,
                    newAuthTokenExpireIn: 10,
                    newRefreshTokenExpiresIn: 10,
                };
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
