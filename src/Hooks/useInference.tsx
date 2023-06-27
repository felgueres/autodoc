import { useState, useEffect, useRef, useContext } from 'react'
import { IMessage } from '../Components/Chat';
import { HOST } from '../constants';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { IBot } from './useChatbots';
import { TMode } from '../Views/Chatbot';
import { AppContext } from '../Contexts/AppContext';

const INFERENCE_API = `${HOST}/v1/inference`

export type TRef = {
    id: string,
    title: string,
    text: string
}

export interface IInference {
    storedToken: string | null,
    isSubmit: boolean,
    conversationId: string,
    setIsSubmit: (isSubmit: boolean) => void,
    setUserMessage: (userMessage: string) => void,
    setConversationId: (conversationId: string) => void,
    messages: Array<IMessage>,
    setMessages: (messages: Array<IMessage>) => void,
    userMessage: string
    chatbot: IBot
    refs: Array<TRef>
    setRefs: (refs: Array<TRef>) => void
    mode: TMode
}

interface IResponse {
    message_id: string,
    role: string,
    content: string,
    conversation_id: string,
    refs: Array<TRef>,
    finish: boolean
}

class RetriableError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'RetriableError'
    }
}

class FatalError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'FatalError'
    }
}

export default function useInference({
    userMessage,
    messages,
    setMessages,
    isSubmit,
    setIsSubmit,
    setUserMessage,
    storedToken,
    conversationId,
    setConversationId,
    chatbot,
    mode,
    refs,
    setRefs,
}: IInference) {

    const { msgs, setMsgs } = useContext(AppContext)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function getTokens() {

            console.log('isSubmit', isSubmit)

            if (isSubmit) {
                setUserMessage('')
                setLoading(true)
                await fetchEventSource(
                    INFERENCE_API,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${storedToken}`,
                        },

                        openWhenHidden: true,

                        body: JSON.stringify(
                            {
                                "upstream_version": 'web_0.3.0',
                                "messages": messages.filter(msg => msg.role !== 'helper'),
                                "user_message": userMessage,
                                "user_message_id": messages[messages.length - 1].id,
                                "conversation_id": conversationId ?? '',
                                "chatbot_id": chatbot.id,
                                "model_id": chatbot.model_id,
                                "sources": chatbot.sources,
                                "temperature": chatbot.temperature,
                                "system_message": chatbot.system_message,
                                "mode": mode
                            }),

                        onopen: async (res) => {
                            if (res.ok) {
                                console.log('res', res)

                            } else if (res.status === 402) {
                                setMsgs([...msgs, { message: 'You have reached your plan limit. Upgrade your plan to continue.', duration: 3000, type: 'error' }])
                                return;
                            }
                        },

                        onmessage: (e) => {
                            try {
                                const data = JSON.parse(e.data);

                                if (data.finish) {
                                    setIsSubmit(false)
                                    return;
                                }

                                setRefs(data.refs)

                                let newMessages = [...messages]
                                newMessages[newMessages.length] = { id: data.message_id, role: 'assistant', content: data.content }
                                setMessages(newMessages)
                                setConversationId(data.conversation_id)

                            } catch (e) {
                                setError(true)
                                setMsgs([...msgs, { message: 'Something went wrong. Try again.', duration: 3000, type: 'error' }])
                            }
                        },

                    }).finally(() => {
                        setLoading(false)
                        setIsSubmit(false)

                    })
            }
        }
        getTokens()
    }, [isSubmit])

    return { loading, setLoading, error, setError }
}