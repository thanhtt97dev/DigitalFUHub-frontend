import Logout from '~/components/Logout';

import { apiGetAuth } from '~/api/defaultApi';
import { useCallback } from 'react';

function Dashboard() {
    const getdata = useCallback(() => {
        apiGetAuth('api/users/hehe')
            .then((res) => {
                alert(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={getdata}>get data</button>
            <Logout />
        </div>
    );
}

export default Dashboard;
