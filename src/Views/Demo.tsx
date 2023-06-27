import { cloneElement, useContext, useEffect, useState } from "react"
import Chatbot from "./Chatbot"
import useChatBots from "../Hooks/useChatbots"
import { AppContext } from "../Contexts/AppContext"
import { Icons, ANONKEY } from "../constants"
import NotFoundPage from "./Notfound"
import Source from "../Components/Source"
import { useNavigate } from "react-router-dom"

const botMap = [
    { name: 'PDF', id: 'bot_225beef13037af5f', type: 'pdf' },
    { name: 'Youtube', id: 'bot_0fe59ba7a451fc78', type: 'video' },
    { name: 'Web', id: 'bot_8707ebc767779883', type: 'url' },
]

export default function Demo() {
    const { storedToken, setStoredToken, setChatbot, chatbot } = useContext(AppContext)
    const [botId, setBotId] = useState(botMap[0].id)
    const { bot, notFound } = useChatBots({ botId, storedToken, type:'bots' })
    const navigate = useNavigate()

    useEffect(() => {
        if (ANONKEY) {
            setStoredToken(ANONKEY)
        }
    }, [ANONKEY])

    useEffect(() => {
        if (bot) {
            setChatbot(bot)
        }
    }, [bot, botId])

    if (notFound) return <NotFoundPage />

    return <>
        {/* Demo */}
        <div className="h-screen flex flex-col text-gray-700">
            <div className="flex justify-between border-b py-2 px-4 bg-gray-700 text-white">
                <button onClick={() => navigate('/')} className="flex items-center gap-2">
                    <span>Upstream</span>
                    <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs">Demo</span>
                </button>
                <button className="flex items-center py-1 px-4 rounded text-sm" onClick={() => navigate('/login')}>
                    Get started
                    {cloneElement(Icons.arrow_right, { className: 'w-4 h-4 fill-current' })}
                </button>
            </div>
            <div className="flex flex-1 flex-col sm:flex-row overflow-auto border-b">
                <div className="w-full sm:w-1/2 p-4 flex flex-col gap-3 sm:border-r">
                    <h1 className="text-xl flex items-center gap-5">
                        <span>Chat with:</span> 
                        {
                            botMap.map((bot) => { return <button key={bot.id} onClick={() => setBotId(bot.id)} className={`flex items-center gap-2 ${botId === bot.id ? 'text-indigo-500 underline  underline-offset-8 font-bold' : ''}`}
                                    disabled={bot.id === ''}>
                                    {bot.name}
                                </button>
                            })
                        }
                    </h1>
                    <Source />
                </div>
                <div className='relative w-full sm:w-1/2'>
                    <Chatbot mode="demo" chatbot={chatbot} />
                </div>
            </div>
        </div>
    </>
}