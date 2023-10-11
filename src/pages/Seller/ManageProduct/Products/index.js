import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Card, Space } from 'antd';
import { useAuthUser } from 'react-auth-kit'

import { getAllProducts } from "~/api/seller";
import Spinning from "~/components/Spinning";



const columns = [
    {
        title: 'Mã',
        dataIndex: 'productId',
        width: '5%',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productId',
        width: '20%',
        render: (productId, record) => {
            return (
                <Link to={`/seller/product/${productId}`} style={{ display: "flex" }}>
                    <img src={record.thumbnail} alt="product" style={{ with: "40px", height: "60px", marginRight: "10px" }} />
                    <span>{record.productName}</span>
                </Link>
            )
        }
    },
    {
        title: 'Phân loại hàng',
        dataIndex: 'productVariants',
        render: ((productVariants) => {
            return (
                <>
                    {productVariants.map((variant, index) => (
                        <p key={index}>{variant.name}</p>
                    ))
                    }
                </>
            )
        }),
        width: '20%',
    },
    {
        title: 'Giá',
        dataIndex: 'productVariants',
        render: ((productVariants) => {
            return (
                <>
                    {productVariants.map((variant, index) => (
                        <p key={index}>{variant.price}</p>
                    ))
                    }
                </>
            )
        }),
        width: '15%',
    },
    {
        title: 'Kho hàng',
        dataIndex: 'productVariants',
        render: ((productVariants) => {
            return (
                <>
                    {productVariants.map((variant, index) => (
                        <p key={index}>{variant.quantity}</p>
                    ))
                    }
                </>
            )
        }),
        width: '15%',
    },
    {
        title: '',
        dataIndex: 'productId',
        render: ((productId) => {
            return (
                <Space direction="vertical">
                    <Link to={`/seller/product/${productId}`}>Cập nhật</Link>
                    <a href={`/product/${productId}`} target="blank">Xem trước</a>
                </Space>
            )
        }),
        width: '15%',
    },
];

function Products() {

    const auth = useAuthUser()
    const user = auth();
    const [loading, setLoading] = useState(true);

    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        getAllProducts(user.id)
            .then((res) => {
                setDataTable(res.data);
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return <>
        <Spinning spinning={loading}>
            <Card
                style={{
                    width: '100%',
                    minHeight: "690px"
                }}
                hoverable
                title="Tất cả sản phẩm"
            >
                <Table columns={columns} pagination={{ size: 10 }} dataSource={dataTable} />
            </Card>
        </Spinning>
    </>
}

export default Products;