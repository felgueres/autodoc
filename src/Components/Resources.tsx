import { cloneElement, useContext, useState } from "react"
import { SupabaseContext } from "../Contexts/SupabaseContext"
import { Icons } from "../constants"
import Modal from "../Modals/Modal"

export const supportMap: { [key: string]: string } = {
    // 'twitter': 'https://twitter.com/intent/tweet?text=@tryupstream%20I%20need%20help%20with%20',
    'whatsapp': 'https://chat.whatsapp.com/IOB1VZhkbIoB5BwmzIidP1',
}

export default function Resources() {
    const { session } = useContext(SupabaseContext)
    const [showSupportModal, setShowSupportModal] = useState(false)
    if (!session) return <></>

    function handleCloseModal() {
        setShowSupportModal(false)
    }

    return <>
        <div key={'support'} className="flex flex-col w-[100px] gap-2 text-sm text-center text-gray-500">
            <div onClick={() => setShowSupportModal(!showSupportModal)} className="py-1 hover:underline cursor-pointer">
                Support
            </div>
        </div>

        <Modal open={showSupportModal} onClose={handleCloseModal}>
            <div className="p-5 bg-white flex flex-col">
                <nav className="flex items-center justify-between mb-2 px-2 w-full border-b py-4">
                    <div className="sm:flex items-center justify-center flex-1">
                        <h1 className="text-2xl font-bold">Get support</h1>
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
