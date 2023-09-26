import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


import { getProductVariants } from "~/api/seller";
import Spinning from "~/components/Spinning";

import { Card, Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from "@ant-design/icons";


function EditProduct() {


    let { productId } = useParams();
    const [loading, setLoading] = useState(true);

    const [productVariants, setProductVariants] = new useState([]);


    useEffect(() => {
        getProductVariants(productId)
            .then((res) => {
                setProductVariants(res.data)
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddNewVariant = () => {
        const NewVariant = {
            name: "",
            price: 0,
            quantity: 0
        }
        setProductVariants((prev) => [...prev, NewVariant]);
    }

    const handleChangeName = (id, value) => {

    }

    console.log(productVariants)
    return <>
        <Spinning spinning={loading}>
            <Card
                title="Thông tin bán hàng"
                style={{
                    width: '100%',
                    height: "40vh"
                }}
                type="inner"
                loading={loading}
            >
                <Row gutter={16}>
                    <Col className="gutter-row" span={3}>
                        <p>Phân loại hàng</p>
                    </Col>
                    <Col className="gutter-row">
                        <>
                            {productVariants.map((value, index) => {
                                return (<Input key={index} value={value.name} onChange={(e) => handleChangeName(value.id, e.target.value)} />)
                            })}
                        </>
                        <Button
                            type="dashed" danger
                            onClick={handleAddNewVariant}
                        >
                            <PlusOutlined /> Thêm loại sản phẩm
                        </Button>

                    </Col>
                </Row>
            </Card>
        </Spinning>
    </>
}

export default EditProduct;