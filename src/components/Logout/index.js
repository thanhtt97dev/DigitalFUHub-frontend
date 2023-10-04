import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { LogoutOutlined } from '@ant-design/icons';

import { revokeToken } from '~/api/user';
import { getJwtId, removeDataAuthInCookies, getUser } from '~/utils';

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

        let userInfo;
        var getUserInfoInterval = setInterval(() => {
            userInfo = getUser();
            if (userInfo === null || userInfo === undefined) {
                clearInterval(getUserInfoInterval);
                return navigate('/home');
            }
        }, 100)
    };

    return (
        <p onClick={hanldeLogout} style={{ color: "#f5222d" }}>
            <LogoutOutlined /> Đăng xuất
        </p>
    );
}

export default Logout;
