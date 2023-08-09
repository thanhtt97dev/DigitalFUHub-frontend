import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';

import { removeAccessTokenIdToCookies } from '~/utils';

function Logout() {
    const signOut = useSignOut();

    const navigate = useNavigate();

    const hanldeLogout = () => {
        removeAccessTokenIdToCookies();
        signOut();
        return navigate('/login');
    };

    return <button onClick={hanldeLogout}>Sign Out</button>;
}

export default Logout;
