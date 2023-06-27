import { cloneElement, useContext, useState } from "react"
import { AppContext } from "../Contexts/AppContext"
import useReaction from "../Hooks/useReaction"
import { SupabaseContext } from "../Contexts/SupabaseContext"
import { HOST, Icons } from "../constants"
import Modal from "../Modals/Modal"
import { shareMap } from "../Views/DocumentView"

export default function Reactions() {
    const { chatbot } = useContext(AppContext)
    const { session } = useContext(SupabaseContext)
    const [shareModal, setShareModal] = useState(false)
    const storedToken = session?.access_token
    const botId = chatbot?.id
    const { likes, triggerRefresh, setTriggerRefresh } = useReaction({ botId })

    if (!chatbot) { return <></> }

    const handleReactor = async () => {
        const REACT_ENDPOINT = `${HOST}/v1/post/${botId}/reactors`
        await fetch(REACT_ENDPOINT,
            {
                body: JSON.stringify(
                    { reaction: 'like' }
                ),
                method: 'POST',
                headers: { Authorization: `Bearer ${storedToken}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.ok) { setTriggerRefresh(!triggerRefresh) } })
    }

    return <>
        <div className="py-2 gap-3 flex">
            <button onClick={handleReactor} className={`flex items-center gap-2 ${likes?.has_reacted ? 'text-red-500' : ''}  hover:text-red-500`}>
                {cloneElement(likes.has_reacted ? Icons.heart_filled : Icons.heart, { className: `w-5 h-5 fill-current` })}
                {likes?.reaction_cnt > 0 ? <span> {likes?.reaction_cnt} </span> : <></>}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setShareModal(true) }}>
                <span className="flex items-center px-3 rounded-full gap-2">
                    {cloneElement(Icons.share, { className: 'w-5 h-5 fill-current' })}
                    Share
                </span>
            </div>
        </div>

        <Modal open={shareModal} onClose={() => { setShareModal(false) }}>
            <div className="w-fullbg-white flex flex-col py-5 px-10">
                <div className="flex justify-between items-center gap-5 mx-auto">
                    <h1 className="text-2xl">Share this assistant</h1>
                    <button className="w-5 h-5" onClick={() => { setShareModal(false) }}> 
                        {cloneElement(Icons.close, { className: 'w-5 h-5 fill-current' })}
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center mx-auto">
                    <div className="w-full mt-4 px-4 py-2 rounded-md flex flex-col justify-center items-center gap-2 ">
                        <p className="text-xl"> {chatbot?.name} </p>
                    </div>
                    {
                        Object.keys(shareMap).map((key) => {
                            return <a key={key} href={`${shareMap[key]}${window.location.href}`} target="_blank" rel="noreferrer" className="w-full mt-4 px-4 py-2 rounded-md flex justify-center items-center gap-2">
                                <img src={`/assets/${key}.svg`} alt={key} className="w-5 h-5" />
                                <span>Share on {key}</span>
                            </a>
                        })
                    }
                </div>
            </div>
        </Modal>
    </>
}