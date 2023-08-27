import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { Button } from 'antd';

import { revokeToken } from '~/api/user';
import { getJwtId, removeDataAuthInCookies } from '~/utils';

function Logout() {
    const signOut = useSignOut();

    const navigate = useNavigate();

    const hanldeLogout = () => {
        const jwtId = getJwtId();
        removeDataAuthInCookies();
        revokeToken(jwtId)
            .then((res) => {
                if (res.status === 200) {
                    console.log('revoke token success!');
                }
            })
            .catch((err) => {
                console.log(err);
            });

        signOut();

        return navigate('/login');
    };

    return <Button onClick={hanldeLogout}>Sign Out</Button>;
}

export default Logout;
