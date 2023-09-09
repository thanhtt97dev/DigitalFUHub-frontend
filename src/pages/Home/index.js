import { useEffect, useState } from 'react';
import { dowloadFile } from '~/api/storage';

function Home() {
    const [srcAudio, setSrcAudio] = useState('')
    useEffect(() => {
        dowloadFile('api/Files/GetFile/450049af-7813-4eb4-8430-c4ba1a40643a.mp3')
            .then(function (response) {
                var srcBlob = URL.createObjectURL(response.data)
                setSrcAudio(srcBlob)
            })
            .catch(function (error) {
                console.log(error);
            })

    }, [])
    return (
        <>
            <h5>DLow</h5>
            <audio controls src={srcAudio}>
            </audio>
            <a href={srcAudio} download={`lilpown.mp3`} > Download audio </a>
        </>

    );
}

export default Home;

/*

   <Link to="/admin">Admin</Link>
            <Logout />
            <Link to="/login">Login</Link>
            */
