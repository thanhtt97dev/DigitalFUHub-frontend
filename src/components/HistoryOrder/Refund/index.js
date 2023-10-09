import CardOrderItem from "../CardOrderItem";
import { Col, Empty, Row } from "antd";
import { useEffect, useState } from "react";
import { getUserId } from "~/utils";
import { getOrders } from "~/api/order";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

function Refund({ status }) {
    const [paramSearch, setParamSearch] = useState({
        userId: getUserId(),
        limit: 5,
        offset: 0,
        statusId: 0
    });
    const [orders, setOrders] = useState([]);
    const [nextOffset, setNextOffset] = useState(0)
    useEffect(() => {
        if (nextOffset !== -1) {
            // call api
            getOrders(paramSearch)
                .then(res => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setOrders(res.data.result.orders);
                        setNextOffset(res.data.result.nextOffset);
                    }
                })
                .catch(err => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramSearch])
    useEffect(() => {
        window.addEventListener("scroll", (e) => {
            var scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)
            if (scrollMaxY - window.scrollY <= 300) {
                if (nextOffset !== -1) {
                    setParamSearch({ ...paramSearch, offset: nextOffset })
                }
            }
        })
        return () => {
            window.removeEventListener("scroll", () => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (<>
        <Row gutter={[0, 16]} style={{ padding: '0 20px' }}>
            {new Array(3).fill(null).map((_, i) => {
                const id = String(i + 1);
                return <Col span={24}><CardOrderItem key={id} /></Col>
            })}
        </Row>
    </>);
}

export default Refund;