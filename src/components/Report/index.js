import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import { postUserExport } from '~/api/export'
import { Button } from 'antd'
import ModelDefault from '../Modal'
import { stringGuid } from '~/utils/string-guid'

export const ExportUser = () => {
    //Modal
    const [openModal, setOpenModel] = useState(false)
    const handleOpenModal = () => {
        setOpenModel(!openModal)
    }

    const handleExport = () => {
        postUserExport({ id: 1 })
            .then((response) => {
                debugger
                const typeResponse = response.data.type
                const fileName = `user_report_${stringGuid()}.xlsx`
                const blob = new Blob([response.data], { type: typeResponse });
                saveAs(blob, fileName)
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