import React, { useEffect, useState } from "react";
import { Carousel } from 'antd';
import { getSliders } from "~/api/slider";
import { Link } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';


const Sliders = () => {
    /// states
    const [sliders, setSliders] = useState([]);
    ///

    /// useEffects
    useEffect(() => {
        getSliders()
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setSliders(data.result);
                    }
                }
            })
            .catch((err) => { })
    }, [])
    ///

    return (<>
        {
            sliders.length > 0 ? (
                <Carousel autoplay style={{ marginBottom: 10, borderRadius: 2 }}>
                    {
                        sliders.map((item) => (
                            <Link to={item.link}>
                                <img src={item.url} alt="slider" style={{ width: '100%', height: 'auto' }} />
                            </Link>
                        ))
                    }
                </Carousel>
            ) : (<></>)
        }
    </>)
}

export default Sliders;