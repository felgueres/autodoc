import { IBot } from "../Hooks/useChatbots"
import { useState } from "react"
import { HOST } from "../constants"
import { postToEndpoint, getFromEndpoint } from "../Utils/Utils"
import { useEffect } from "react"
import { Actions } from "../Utils/Utils"

interface IEmbedModalProps {
    chatbot: IBot | null
    storedToken: string
}

export type IEmbedResponse = {
    status: string
    embed_id: string | null
    is_active: boolean
}

export default function EmbedModal({ chatbot, storedToken }: IEmbedModalProps) {
    const [embedId, setEmbedId] = useState(null)
    const [embedOn, setEmbedOn] = useState(false)

    useEffect(() => {
        const GET_EMBEDS_ENDPOINT = `${HOST}/v1/bot/${chatbot?.id}/embed`
        getFromEndpoint(GET_EMBEDS_ENDPOINT, storedToken).then((res) => {
            res = res as IEmbedResponse
            if (res.status === 'success') {
                setEmbedId(res.embed_id)
                setEmbedOn(res.is_active)
            }
        })
    }, [chatbot])

    const handleEmbedToggle = async () => {
        const NEW_EMBED_ENDPOINT = `${HOST}/v1/bot/${chatbot?.id}/embed`
        await postToEndpoint(NEW_EMBED_ENDPOINT, { "is_active": !embedOn }, 'POST', storedToken).then((res) => {
            res = res as IEmbedResponse
            if (res.status === 'success') {
                setEmbedId(res.embed_id)
                setEmbedOn(res.is_active)
            }
            else if (res.status === 'error') {
                // handle error
            }
        })
    }

    function EmbedToggle({ embedOn }: { embedOn: boolean }) {
        return <> <button onClick={handleEmbedToggle} className={`flex font-medium items-center gap-2 px-4 py-2 rounded-md text-sm ${embedOn ? 'bg-gray-300' : 'bg-indigo-700 text-gray-200'} mt-4 mb-4`}>
            <span>{embedOn ? 'Make chatbot private' : 'Make chatbot public'}</span>
        </button>
        </>
    }

    const PUBLIC_LINK = `https://upstreamapi.com/embed/chatbot?id=${embedId}`
    const EMBED_LINK = `<script src="https://upstreamapi.com/widget.min.js" id="${embedId}" defer></script>`

    return <>
        <div className="flex flex-col">
            <EmbedToggle embedOn={embedOn} />
            {
                embedOn ? <>
                    <p className="font-medium"> To add to your website with widget</p>
                    <small>Paste this line in your html code</small>
                    <div className="flex gap-3 mt-1">
                        <input className="w-full flex-1 py-1 pl-2 pr-4 border rounded-sm text-sm text-slate-700" placeholder={embedOn ? '' : 'Link disabled'} value={embedOn ? EMBED_LINK : ''} readOnly />
                        <Actions text={EMBED_LINK} />
                    </div>
                    <br />
                    <p className="font-medium">Or share with a link</p>
                    <div className="flex gap-3 mt-1">
                        <input className="w-full flex-1 py-1 pl-2 pr-4 border rounded-sm text-sm text-slate-700" placeholder={embedOn ? '' : 'Link disabled'} value={embedOn ? PUBLIC_LINK : ''} readOnly />
                        <Actions text={PUBLIC_LINK} />
                    </div>
                </> : null
            }
        </div>
    </>
}
