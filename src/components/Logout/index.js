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

        revokeToken(jwtId)
            .then((res) => {
                console.log('revoke token success!');
                removeDataAuthInCookies();
                signOut();
            })
            .catch((err) => {
                console.log(err);
            });

        return navigate('/login');
    };

    return <Button onClick={hanldeLogout}>Sign Out</Button>;
}

export default Logout;
