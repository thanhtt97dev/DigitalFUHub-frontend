import { GoogleLogin, useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';

function GoogleSignIn({ onFinish }) {
    const handleCredentialResponse = (response) => {
        googleLogout();
        onFinish({ gToken: response.credential, google: true })
    }
    const handleError = () => {
        console.log('SignIn Error!');
    }

    useGoogleOneTapLogin({
        onSuccess: handleCredentialResponse,
        onError: handleError,
    });
    return <>
        <GoogleLogin
            onSuccess={handleCredentialResponse}
            onError={handleError}
            useOneTap
            size='large'
        />
    </>;
}

export default GoogleSignIn;