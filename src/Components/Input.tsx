import { createRef, useContext, useEffect, useState } from "react"
import { IMessage } from "./Chat"
import { isArabic } from "./Message"
import { AccountContext } from "../Contexts/AuthContext"
import { AppContext } from "../Contexts/AppContext"
import { MetadataKeys } from "./AssistantSettings"

export interface IInputProps {
    isSubmit: boolean
    setIsSubmit: (isSubmit: boolean) => void
    messages: Array<IMessage>
    setMessages: (messages: Array<IMessage>) => void
    loading: boolean
    userMessage: string
    setUserMessage: (userMessage: string) => void
}

export default function Input({ messages, setMessages, loading, isSubmit, setIsSubmit, setUserMessage, userMessage }: IInputProps) {
    const { usage, myPlan } = useContext(AccountContext)
    const { mode, chatbot } = useContext(AppContext)
    const creditsLeft = myPlan.maxMessages - usage.n_messages
    const [liveCredits, setLiveCredits] = useState(creditsLeft)
    const [isArabicMsg, setIsArabicMsg] = useState(false)
    const suggestionBox = createRef<HTMLTextAreaElement>()
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        if (e.currentTarget.value === '\n') { return }
        setUserMessage(e.currentTarget.value)
    }
    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
        else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault()
            setUserMessage(userMessage + '\n')
        }
    }

    const handleSubmit = () => {
        if (userMessage === '') { return }
        setIsSubmit(true) // triggers an api call, useful to make it explicit 
        setMessages([...messages, { id: messages.filter(msg => msg.role !== 'helper').length + 1, role: 'user', content: userMessage }])
        setLiveCredits(liveCredits - 1)
        // 
    }

    // Focus on suggestionbox
    useEffect(() => {
        suggestionBox.current?.focus()
    }, [suggestionBox])

    useEffect(() => {
        // Makes the suggestionbox expand to fit content and resets to initial heigh on submit
        if (suggestionBox?.current) {
            suggestionBox.current.style.height = '0px'
            suggestionBox.current.style.height = String(Math.max(suggestionBox.current.scrollHeight, 24)) + 'px'
        }
        if (isSubmit) {
            const inputArea = document.getElementById('inputArea') as HTMLTextAreaElement
            inputArea.style.height = '32px'
        }
    }, [userMessage, isSubmit])

    useEffect(() => {
        setIsArabicMsg(isArabic(userMessage))
    }, [userMessage])

    const exceedPlan = liveCredits <= 0

    return <>
        <div className={`absolute bottom-0 left-0 bg-white w-full pb-2 pt-2 ${mode === 'app' ? 'px-4 sm:px-4' : 'px-2'}`}>
            <div className="w-full lg:max-w-2xl xl:max-w-3xl lg:mx-auto">
            {
                chatbot && MetadataKeys.SUGGEST_MESSAGES in chatbot.metadata && chatbot.metadata[MetadataKeys.SUGGEST_MESSAGES] !== '' ? chatbot.metadata[MetadataKeys.SUGGEST_MESSAGES].split('\n').map((msg, i) => {
                    return  <button
                            key={i}
                            onClick={() => setUserMessage(msg)}
                            className='inline-block px-2 py-1 mr-2 mb-2 text-sm font-medium text-white bg-indigo-500 rounded-md opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
                            {msg}
                        </button>
                }) : null
            }
            </div>
            <div className="flex items-center p-1 outline rounded-md shadow-sm border border-black/10 outline-none h-full lg:max-w-2xl xl:max-w-3xl lg:mx-auto">
                <textarea
                    id="inputArea"
                    value={loading ? '' : userMessage}
                    onChange={handleChange}
                    ref={suggestionBox}
                    onKeyDown={handleOnKeyDown}
                    disabled={loading || (exceedPlan)}
                    autoFocus={true}
                    dir={isArabicMsg ? 'rtl' : 'ltr'}
                    className={`${mode === 'app' ? 'text-base' : 'text-sm'} w-full pr-7 pl-4 pt-2 leading-6 max-h-32 outline-none box-content resize-none overflow-hidden overflow-y-auto ${isArabicMsg ? 'rtl' : 'ltr'}`}
                    placeholder={exceedPlan ? "You are out of messages" : "Send a message ..."} />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-shrink-0 w-7 h-7 ml-2 mr-2 text-gray-400 outline-none focus:outline-none  bg-transparent">
                    <svg className="w-5 h-5 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            transform="rotate(90,12,12)" />
                    </svg>
                </button>
            </div>
        </div>
    </>
} 