import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


import { getProductById } from "~/api/seller";
import Spinning from "~/components/Spinning";

import { Card, Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { getUserId } from "~/utils";


function EditProduct() {
    const { productId } = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const userId = getUserId();
        getProductById(userId, productId)
            .then((res) => {
                setLoading(false);
                console.log(res);
            })
            .catch((err) => {
                setLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>
    </>
}

export default EditProduct;