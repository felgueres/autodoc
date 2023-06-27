import { cloneElement, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useChatBots from "../Hooks/useChatbots"
import { SupabaseContext } from "../Contexts/SupabaseContext"
import { AppContext } from "../Contexts/AppContext"
import Source from "../Components/Source"
import Chatbot from "./Chatbot"
import NotFoundPage from "./Notfound"
import Extractor from "./Extractor"
import { Icons, VERSION } from "../constants"
import CreateSidebar from "../Components/CreateSidebar"
import Resources from "../Components/Resources"
import { NavLink } from "react-router-dom"
import { since } from "../Utils/Utils"

declare global {
    interface Window {
        StatusPage: {
            page: {
                new(options: { page: string }): any;
            };
        };
    }
}

export const shareMap: { [key: string]: string } = {
    'twitter': 'https://twitter.com/intent/tweet?text=Chat%20with&url=',
}

export default function Document() {
    const { session } = useContext(SupabaseContext)
    const { chatbot, setChatbot, storedToken, setStoredToken } = useContext(AppContext)
    const botId = useParams().botId || null
    // get state from navigate
    const { bot, notFound, setNotFound } = useChatBots({ storedToken, botId, 'type': 'bots' })
    const navigate = useNavigate()
    const [showSource, setShowSource] = useState<boolean>(true)

    useEffect(() => {
        if (botId === null)
            setNotFound(true)
    },
        [botId, bot, setNotFound]
    )
    useEffect(() => { if (bot) { setChatbot(bot) } }, [bot, botId, setChatbot])

    useEffect(() => {
        if (session) { setStoredToken(session.access_token) }
    }, [setStoredToken, session])

    if (notFound) return <NotFoundPage />

    const MyStatusPageComponent: React.FC = () => {
        const [status, setStatus] = useState<string>('')
        useEffect(() => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdn.statuspage.io/se-v2.js';
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                const sp = new window.StatusPage.page({ page: 'jbxzcdv9xc4d' });
                sp.components({
                    success: (data: any) => {
                        setStatus(data?.components[0].status)
                    },
                });
            };
            return () => {
                document.body.removeChild(script);
            };
        }, []);
        return <div className="flex items-center gap-2 text-sm justify-center">
            API Status {cloneElement(Icons.check_circle, { className: `text-${status === 'operational' ? 'green' : 'red'}-500 fill-current h-5 w-5` })}
        </div>
    };


    function CopyId() {
        const [copied, setCopied] = useState<boolean>(false)

        const handleCopy = () => {
            navigator.clipboard.writeText(chatbot.id)
            setCopied(true)
        }

        return <div onClick={handleCopy} className="text-gray-400 text-sm flex items-center gap-1 cursor-pointer hover:text-gray-800">
            {cloneElement(copied ? Icons.check : Icons.content_paste, { className: 'h-5 w-5 fill-current' })}
            {chatbot.id}
        </div>
    }

    return <>
        <div className="h-full w-full text-black overflow-y-auto">
            <div className="px-4 flex flex-col h-full">
                <div className="border-gray-200">
                    <div className="w-[56rem] h-full mx-auto flex flex-row gap-10 pt-5">
                        <div className="flex flex-col gap-5 w-[100px]">
                            <span onClick={() => navigate('/')} className="font-semibold text-center text-xl tracking-tight cursor-pointer">Autodocs</span>
                            <CreateSidebar />
                            <MyStatusPageComponent />
                        </div>
                        <div className="w-full">
                            <div className="flex flex-col gap-4 border-b pb-4">
                                <span className="flex items-center gap-2 text-sm cursor-pointer">
                                    <NavLink className='text-gray-400' to='/documents' >Documents /</NavLink> {chatbot.name}
                                </span>
                                <div className="flex justify-between">
                                    <div className="flex gap-2">
                                        <span className="border rounded-full p-3">
                                            <NavLink to={`/edit/post/${chatbot.id}`} className="flex items-center gap-1 text-gray-400 hover:text-gray-800">
                                                {cloneElement(Icons.description, { className: 'h-5 w-5 text-gray-400' })}
                                            </NavLink>
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="font-semibold"> {chatbot.name} </span>
                                            <div className="flex gap-1 text-gray-400 items-center text-sm">
                                                <span className="text-sm">Created: {since(chatbot.created_at)} </span>
                                                {/* divider */}
                                                <span className="text-gray-400">|</span>
                                                <NavLink to={`/edit/post/${chatbot.id}`} className="flex items-center gap-1 text-gray-400 hover:text-gray-800">
                                                    Edit
                                                    {cloneElement(Icons.edit_note, { className: 'h-5 w-5 text-gray-400' })}
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                    <CopyId />
                                </div>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <Extractor />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
