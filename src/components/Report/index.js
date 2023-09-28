import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import { Button } from 'antd'
import { useAuthUser } from 'react-auth-kit'

import { userInfo } from '~/api/report'
import { stringGuid } from '~/utils'
import ModelDefault from '../Modal'

export const ReportUserInfo = () => {

    const auth = useAuthUser();
    const user = auth();

    //Modal
    const [openModal, setOpenModel] = useState(false)
    const handleOpenModal = () => {
        setOpenModel(!openModal)
    }

    const handleExport = () => {
        if (user === null) {
            alert("cannot get report !");
            return;
        }
        userInfo({ id: user.id })
            .then((response) => {
                const typeResponse = response.data.type
                const fileName = `user_report_${stringGuid()}.xlsx`
                const blob = new Blob([response.data], { type: typeResponse });
                saveAs(blob, fileName)
            })
            .catch((err) => {
                alert("cannot get report !");
            })
    }

    const dataModal = {
        title: "Export file excel",
        content: "Do you want to export to excel file?",
        handleOpenModal,
        openModal,
        action: handleExport
    }

    return (
        <>
            <Button onClick={handleOpenModal} type="primary">Export</Button>
            <ModelDefault data={dataModal} />
        </>
    )
}