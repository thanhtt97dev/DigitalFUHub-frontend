import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { LogoutOutlined } from '@ant-design/icons';

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

        return navigate('/home');
    };

    return (
        <p onClick={hanldeLogout} style={{ color: "#f5222d" }}>
            <LogoutOutlined /> Đăng xuất
        </p>
    );
}

export default Logout;
