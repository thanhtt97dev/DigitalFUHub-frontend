/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkShopUser } from "~/api/shop";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { removeDataAuthInCookies } from "~/utils";
import { RESPONSE_CODE_SHOP_BANNED } from "~/constants";
// import { RESPONSE_CODE_SHOP_BANNED, RESPONSE_CODE_SUCCESS } from "~/constants";
// import { NotificationContext } from "~/context/UI/NotificationContext";
export const CheckUserBanContext = createContext();

function CheckUserBan({ children }) {
    const [isActive, setIsActive] = useState(false);
    const [isShopBan, setIsShopBan] = useState(false);
    const location = useLocation();
    const signOut = useSignOut();
    const auth = useAuthUser();
    const user = auth();
    // const notification = useContext(NotificationContext);
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (user === undefined || user === null) {
            setIsActive(true);
        } else {
            checkShopUser()
                .then(res => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                        setIsShopBan(true);
                        setIsActive(true);
                    } else {
                        setIsActive(true);
                        setIsShopBan(false);
                    }
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        setIsActive(false);
                        setIsShopBan(false);
                        removeDataAuthInCookies();
                        signOut();
                        return navigate('/accessDenied')
                    } else {
                        setIsActive(true);
                        setIsShopBan(false);
                    }
                })
        }
    }, [location])
    return (<><CheckUserBanContext.Provider value={isShopBan}>{isActive === true ? children : null}</CheckUserBanContext.Provider></>);
}

export default CheckUserBan;