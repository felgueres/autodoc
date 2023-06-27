import { cloneElement, useContext, useEffect, useRef, useState } from "react"
import { IMessage } from "./Chat"
import { TRef } from "../Hooks/useInference"
import { AppContext } from "../Contexts/AppContext"
import { MetadataKeys } from "./AssistantSettings"

export function isArabic(text: string) {
    const arabic = /[\u0600-\u06FF]/
    return arabic.test(text)
}

export default function Messages({ messages }: { messages: IMessage[] }) {
    const { loading, refs: references, mode, chatbot } = useContext(AppContext)
    const ref = useRef<HTMLDivElement>(null)
    const [hasRefs, setHasRefs] = useState(false)
    const [showRefs, setShowRefs] = useState(false)

    useEffect(() => {
        if (references?.length > 0) {
            // Check if the chatbot has references enabled
            if (MetadataKeys.INCLUDE_REFERENCES in chatbot.metadata) {
                setHasRefs(chatbot.metadata[MetadataKeys.INCLUDE_REFERENCES])
            } else {
                setHasRefs(true)
            }
        } else {
            setHasRefs(false)
        }
    }, [references])

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'auto' })
    }, [messages, loading])

    function Message({ message, isLast }: { message: IMessage, isLast: boolean }) {
        const isArabicMsg = isArabic(message.content)

        return <div className={`w-full px-2 ${hasRefs ? '' : 'border-b'} ${message.role === 'user' ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="leading-7 gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl p-4 md:py-6 flex lg:px-0 m-auto">
                <div className="w-[30px] sm:w-[40px] flex flex-col relative items-end self-start">
                    {
                        message.role === 'user' ?
                            <div className="w-7 h-7 flex justify-center items-center bg-gray-100 text-indigo-500 rounded-full sm:w-10 sm:h-10 overflow-clip"> You </div>
                            :
                            <div className="w-7 h-7 flex justify-center items-center bg-indigo-500 text-white rounded-full sm:w-10 sm:h-10 overflow-clip"> AI </div>
                    }
                </div>
                <div className="relative flex items-center w-[calc(100%-50px)] md:gap-3 lg:w-[calc(100%-115px)] rtl" dir={isArabicMsg ? 'rtl' : 'ltr'}>
                    <p className="whitespace-pre-line rtl">
                        {message.content}
                        {/* add a blinking caret at the end of the message */}
                        {isLast && loading && message.role === 'assistant' && <span className="pl-1 border-gray-600 border-r-8 animate-blink"></span>}
                    </p>
                </div>
            </div>
        </div>
    }

    function References({ references, loading }: { references: Array<TRef>, loading: boolean }) {
        // check if empty list
        if (references?.length === 0 || loading) return <></>
        function RefItem({ reference, i }: { reference: TRef, i: number }) {
            const [show, setShow] = useState(false)
            return <>
                <div className="w-full bg-gray-50 ">
                    <div className="cursor text-sm px-4 leading-2 gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl sm:py-1 flex lg:px-0 m-auto">
                        <div onClick={() => setShow(!show)} className="w-[30px] text-gray-700 cursor-pointer flex flex-col flex-shrink-0 relative items-end self-start">
                            [{i + 1}]
                        </div>
                        <div className="relative flex flex-col w-[calc(100%-50px)] sm:gap-3 lg:w-[calc(100%-115px)] rtl" dir={isArabic(reference.title) ? 'rtl' : 'ltr'}>
                            <p onClick={() => setShow(!show)} className="text-indigo-500 cursor-pointer font-semibold overflow-clip text-ellipsis">
                                {reference.title}
                            </p>
                            {show &&
                                <div className="rtl" dir={isArabic(reference.text) ? 'rtl' : 'ltr'}>
                                    <p className="whitespace-pre-line"> {reference.text} </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        }
        return <>
            {references?.map((reference, i) => { return <RefItem i={i} key={i} reference={reference} /> })}
        </>
    }

    return <>
        <div className='flex flex-col justify-center overflow-x-auto'>
            <div id='chat-box' className={`w-full justify-center items-center ${mode === 'app' ? 'text-base' : 'text-sm'}`}>
                {messages.map((message, i) => { return <Message key={i} message={message} isLast={i === messages.length - 1} /> })}
            </div>
            <button onClick={() => setShowRefs(!showRefs)} className={`text-sm w-full text-indigo-500 font-semibold py-2 ${showRefs ? 'bg-gray-50' : 'bg-white'} ${hasRefs ? '' : 'hidden'}`}>
                {showRefs ? 'Hide' : 'Learn more'}
            </button>
            {showRefs && <References references={references} loading={loading} />}
            <div ref={ref} />
        </div>
        <div className={`w-full flex-shrink-0 ${mode === 'app' ? 'h-32 sm:h-48' : 'h-[95px]'}`}></div>
    </>
}