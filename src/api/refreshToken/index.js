import { createRefresh } from 'react-auth-kit';

import { apiPost } from '~/api/defaultApi';
import { getRefreshToken, getToken, saveRefreshTokenInlocalStorage } from '~/utils';

const refreshToken = createRefresh({
    interval: 1, // Refreshs the token in every 10 minutes
    refreshApiCallback: async (param) => {
        const data = {
            refreshToken: getRefreshToken(),
            AccessToken: getToken(),
        };

        apiPost('api/users/refreshToken', data)
            .then((res) => {
                if (res.status === 200) {
                    saveRefreshTokenInlocalStorage(res.data.accessToken, res.data.refreshToken);
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
