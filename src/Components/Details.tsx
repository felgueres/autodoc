import { cloneElement, useContext } from "react"
import { AppContext } from "../Contexts/AppContext"
import { since } from "../Utils/Utils"
import { Icons } from "../constants"

export default function Details() {
    const { chatbot } = useContext(AppContext)
    if (!chatbot) { return <></> }

    const dtype = chatbot?.sources[0]?.dtype

    return <div className="bg-zinc-100 py-2 px-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm">
            <span className="text-sm text-gray-400"> {since(chatbot.created_at)} </span>
            {dtype === 'pdf' ?
                <span className="text-sm text-gray-400"> {chatbot?.sources[0]?.name} </span> :
                dtype === 'video' ?
                    <a href={`${chatbot.sources[0]?.name}`} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:underline flex items-center gap-1">
                        {cloneElement(Icons.external_link, { className: "w-5 h-5 fill-current" })}
                        View on Youtube </a>
                    : <> <a href={`${chatbot.sources[0]?.name}`} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:underline flex items-center gap-1">
                        {cloneElement(Icons.external_link, { className: "w-5 h-5 fill-current" })}
                        Go to website
                    </a>
                    </>
            }
        </div>
    </div>
}