import { useEffect, useState } from 'react';
import { dowloadFile } from '~/api/storage';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import { ReportUserInfo } from '~/components/Report'
function Home() {
    const [srcAudio, setSrcAudio] = useState('')
    useEffect(() => {
        dowloadFile('450049af-7813-4eb4-8430-c4ba1a40643a.mp3')
            .then(function (response) {
                var srcBlob = URL.createObjectURL(response.data)
                setSrcAudio(srcBlob)
            })
            .catch(function (error) {
                // console.log(error);
            })
    }, [])
    return (
        <>
            <h5>DLow</h5>
            <audio controls src={srcAudio}>
            </audio>
            <a href={srcAudio} download={`lilpown.mp3`} > Download audio </a>
            <Link to={'/upload'}>
                <Button type="primary">Upload</Button>
            </Link>
            <Link to={'/product/1'}>
                <Button type="primary">/product/1</Button>
            </Link>
            <ReportUserInfo />
        </>

    );
}

export default Home;