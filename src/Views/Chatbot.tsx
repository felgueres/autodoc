import { useContext, useEffect, useState } from "react";
import { IMessage } from "../Components/Chat";
import { INITIAL_VALUES } from "../constants";
import Chat from "../Components/Chat";
import useInference from "../Hooks/useInference";
import { IBot } from "../Hooks/useChatbots";
import Input from "../Components/Input";
import { TRef } from "../Hooks/useInference";
import '../input.css';
import { AppContext } from "../Contexts/AppContext";

export type TMode = 'embed' | 'app' | 'viewer' | 'demo'


// Embed Props, oprtional
interface IEmbedProps {
    chatbotId?: string,
    mode?: TMode 
    messages?: Array<IMessage>
    chatbot: IBot
}

export default function Chatbot({ mode, chatbot }: IEmbedProps) {
    const { storedToken } = useContext(AppContext)
    const [conversationId, setConversationId] = useState(INITIAL_VALUES.conversationId)
    const [isSubmit, setIsSubmit] = useState(false);
    const [userMessage, setUserMessage] = useState(INITIAL_VALUES.userMessage);
    const [messages, setMessages] = useState(INITIAL_VALUES.messages)
    const [error, setError] = useState(false);
    const [refs, setRefs] = useState<Array<TRef>>([])

    // add a reset button in the bottom
    function reset() {
        setMessages(INITIAL_VALUES.messages)
        setConversationId(INITIAL_VALUES.conversationId)
        setRefs([])
    }

    useEffect(() => {
        setMessages(chatbot.metadata?.start_message ? [chatbot.metadata.start_message] : INITIAL_VALUES.messages)
    }, [chatbot])

    const { loading } = useInference({
        isSubmit,
        setIsSubmit,
        setUserMessage,
        storedToken,
        setConversationId,
        conversationId,
        userMessage,
        messages,
        setMessages,
        chatbot,
        refs,
        setRefs,
        mode: mode || 'app',
    })

    if (storedToken === null || error || !chatbot.id || (mode === 'viewer' && !chatbot.sources.length)) { return <></> }

    return <>
        <Chat messages={messages} />
        <Input
            loading={loading || mode === 'viewer'}
            isSubmit={isSubmit}
            setIsSubmit={setIsSubmit}
            messages={messages}
            setMessages={setMessages}
            userMessage={userMessage}
            setUserMessage={setUserMessage}
        />
    </>
}