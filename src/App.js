import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Routing from './routes/Routing';
import Auth from './routes/Auth';
//import refreshToken from '~/api/refreshToken';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
        </GoogleOAuthProvider>
    );
}

export default App;
