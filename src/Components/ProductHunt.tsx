import { cloneElement } from "react";
import { Icons } from "../constants";
import Modal from "../Modals/Modal";
import { supportMap } from "./Resources";
import { useState } from "react";

export default function ProductHunt() {
    const [showSupportModal, setShowSupportModal] = useState(false)
    const handleCloseModal = () => {
        setShowSupportModal(false)
    }
    const handleOpenModal = () => {
        setShowSupportModal(!showSupportModal)
    }
    return <>
        <div className="fixed bottom-5 right-10 z-50">
            <div className="flex gap-2 items-center">
                <button onClick={handleOpenModal} className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 shadow-lg text-white focus:outline-none">
                    {cloneElement(Icons.sms, { className: 'w-6 h-6 fill-current' })}
                </button>
            </div>
        </div>
        <Modal open={showSupportModal} onClose={handleCloseModal}>
            <div className="p-5 bg-white flex flex-col">
                <nav className="flex items-center justify-between mb-2 px-2 w-full border-b py-4">
                    <div className="sm:flex items-center justify-center flex-1">
                        <h1 className="text-2xl font-bold">Need help?</h1>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2" onClick={() => handleCloseModal()}>
                        {cloneElement(Icons.close, { className: 'w-5 h-5' })}
                    </div>
                </nav>
                <div className="sm:w-[420px] flex flex-col justify-center items-center mx-auto">
                    <small> Usually respond within 1 hour.</small>
                    {
                        Object.keys(supportMap).map((key) => {
                            return <a key={key} href={`${supportMap[key]}`} target="_blank" rel="noreferrer" className="w-full mt-4 px-4 py-2 rounded-md flex justify-center items-center gap-2">
                                <img src={`/assets/${key}.svg`} alt={key} className="w-5 h-5" />
                                <span className="text-base capitalize">On {key}</span>
                            </a>
                        })
                    }
                </div>
            </div>
        </Modal>
    </>
}