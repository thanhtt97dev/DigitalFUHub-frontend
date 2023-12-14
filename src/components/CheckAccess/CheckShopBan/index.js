/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkShopUser } from "~/api/shop";
import { RESPONSE_CODE_SHOP_BANNED, RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { removeDataAuthInCookies } from "~/utils";
import { useAuthUser, useSignOut } from "react-auth-kit";

function CheckShopBan({ children }) {
    const signOut = useSignOut();
    const auth = useAuthUser();
    const user = auth();
    const [isActive, setIsActive] = useState(false);
    const notification = useContext(NotificationContext);
    const location = useLocation();
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (user === undefined || user === null) {
            setIsActive(true);
        } else {
            checkShopUser()
                .then(res => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setIsActive(true);
                    } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                        notification("error", "Cửa hàng của bạn đang bị khóa.")
                        setIsActive(false);
                        return navigate('/shopBanned')
                    } else {
                        setIsActive(true);
                    }
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        setIsActive(false);
                        removeDataAuthInCookies();
                        signOut();
                        return navigate('/accessDenied')
                    } else {
                        setIsActive(true);
                    }
                })
        }
    }, [location])
    return (<>{isActive === true ? children : null}</>);
}

export default CheckShopBan;