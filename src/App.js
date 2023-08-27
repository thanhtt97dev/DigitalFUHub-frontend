import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter as Router } from 'react-router-dom';

import Routing from './routes/Routing';
import Auth from './routes/Auth';
//import refreshToken from '~/api/refreshToken';

function App() {
    return (
        <AuthProvider
            authType={'cookie'}
            authName={'_auth'}
            //refresh={refreshToken}
            cookieDomain={window.location.hostname}
            cookieSecure
        >
            <Auth>
                <Router>
                    <Routing />
                </Router>
            </Auth>
        </AuthProvider>
    );
}

export default App;
