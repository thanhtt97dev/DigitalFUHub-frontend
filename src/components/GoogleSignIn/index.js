import { GoogleLogin, useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';
import { decodeGoogleCredential } from '~/utils';

function GoogleSignIn({ onFinish }) {
    const handleCredentialResponse = (response) => {
        googleLogout();
        const userCredential = decodeGoogleCredential(response.credential);
        onFinish({ email: userCredential.email, fullname: userCredential.name, google: true })
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