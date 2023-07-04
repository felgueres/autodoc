import { cloneElement, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modals/Modal";
import { Icons } from "../constants";
import { supportMap } from "./Resources";

export default function Footer() {
    const [showSupportModal, setShowSupportModal] = useState(false)

    const handleCloseModal = () => {
        setShowSupportModal(false)
    }

    return <div className="bg-white mb-4 border-t px-5">
        <nav className="w-full sm:w-[56rem] flex items-center justify-between py-4 bg-white mx-auto">
            <div className="flex items-center gap-2">
                <Link to='/' className="font-semibold text-xl tracking-tight cursor-pointer">Autodoc AI</Link>
            </div>
            <div className="mt-1 flex items-center pr-4">
                <div>
                    <span className="ml-4 text-sm text-gray-500 hover:text-gray-700"> API (soon) </span>
                </div>
                <a href="/privacy" className="ml-4 text-sm text-gray-500 hover:text-gray-700">Terms</a>
                <Link to="/pricing" className="ml-4 text-sm text-gray-500 hover:text-gray-700">Pricing</Link>
                {/* <Link to='https://twitter.com/tryupstream' target="_blank" rel="noreferrer" className="ml-4 text-sm ">
                    <img src="/assets/twitter.svg" alt="twitter" className="w-5 h-5 ml-2" />
                </Link> */}
            </div>
        </nav>

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
    </div>
}
