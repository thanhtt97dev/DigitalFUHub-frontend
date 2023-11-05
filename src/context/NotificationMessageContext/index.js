import React, { useEffect, useState, createContext, useContext } from 'react';
import { getUserId } from '~/utils';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { getNumberConversationUnRead } from '~/api/chat';
import { ChatContext } from "~/context/ChatContext";

export const NotificationMessageContext = createContext();

function NotificationMessage({ children }) {
    /// states
    const [numberConversationUnRead, setNumberConversationUnRead] = useState(0);
    const [reloadNumberConversationFlag, setReloadNumberConversationFlag] = useState(false);
    const [isOpenChat, setIsOpenChat] = useState(false);
    ///

    ///functions
    const reloadNumberConversation = () => {
        // set value for flag
        setReloadNumberConversationFlag(!reloadNumberConversationFlag);
    }

    const addOneNumberConversation = () => {
        setNumberConversationUnRead((prev) => prev + 1);
    }

    const minusOneNumberConversation = () => {
        setNumberConversationUnRead((prev) => prev - 1);
    }
    ///

    /// useEffects
    useEffect(() => {
        var userId = getUserId();
        if (userId === undefined || userId === null) return;
        getNumberConversationUnRead(userId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        if (result !== numberConversationUnRead) {
                            setNumberConversationUnRead(result);
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadNumberConversationFlag])


    const message = useContext(ChatContext);

    useEffect(() => {
        if (isOpenChat) return;
        if (message) {
            console.log('reload context')
            reloadNumberConversation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])


    /// value context
    const value = {
        numberConversationUnRead: numberConversationUnRead,
        addOneNumberConversation: addOneNumberConversation,
        minusOneNumberConversation: minusOneNumberConversation,
        reloadNumberConversation: reloadNumberConversation,
        setIsOpenChat: setIsOpenChat
    }
    ///


    return (
        <NotificationMessageContext.Provider value={value}>
            {children}
        </NotificationMessageContext.Provider>
    );
}

export default NotificationMessage;
