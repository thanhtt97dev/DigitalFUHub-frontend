import { Button, Result } from "antd";
import { Link } from "react-router-dom";

function ShopBan() {
    return (<><Result
        status="warning"
        title="Cửa hàng đang bị khóa"
        extra={
            <Link to={"/home"}>
                <Button type="primary" >
                    Trở về trang chủ
                </Button>
            </Link>
        }
    /></>);
}

export default ShopBan;