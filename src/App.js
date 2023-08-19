import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter as Router } from 'react-router-dom';

import Routing from './routes/Routing';
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
            <Router>
                <Routing />
            </Router>
        </AuthProvider>
    );
}

export default App;
