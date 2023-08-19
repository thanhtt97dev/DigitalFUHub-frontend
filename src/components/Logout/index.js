import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';

import { revokeToken } from '~/api/user';
import { getJwtId } from '~/utils';

function Logout() {
    const signOut = useSignOut();

    const navigate = useNavigate();

    const hanldeLogout = () => {
        const jwtId = getJwtId();

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

    return <button onClick={hanldeLogout}>Sign Out</button>;
}

export default Logout;
