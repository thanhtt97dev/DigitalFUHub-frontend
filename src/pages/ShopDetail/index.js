import React, { useEffect, useState } from "react";
import { getShopDetail } from "~/api/shop";
import { useParams } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import GeneralDescription from "~/components/ShopDetail/GeneralDescription";
import DetailedDescription from "~/components/ShopDetail/DetailedDescription";
const ShopDetail = () => {
    /// states
    const { userId } = useParams();
    const [shop, setShop] = useState({});
    ///

    /// useEffects
    useEffect(() => {

        getShopDetail(userId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setShop(result);
                    }
                }
            })

    }, [userId])
    ///


    return (<>
        <GeneralDescription shop={shop} />


        <DetailedDescription shop={shop} />
    </>)
}

export default ShopDetail;