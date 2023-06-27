import { useContext, useEffect, useState } from 'react';
import { IMessage } from '../Components/Chat';
import { HOST, INITIAL_VALUES } from '../constants';
import { SupabaseContext } from '../Contexts/SupabaseContext';

interface IUseConversation {
    setMessages: (messages: Array<IMessage>) => void,
    conversationId?: string,
    isConversationChange: boolean,
    setIsConversationChange: (isConversationChanged: boolean) => void
}

export default function useConversation({ setMessages, conversationId, isConversationChange, setIsConversationChange }: IUseConversation) {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const [botId, setBotId] = useState<string>('')
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const CONVERSATION_ENDPOINT = `${HOST}/v1/conversation`
        async function fetchConversation() {
            if (!storedToken) { return }
            if (!conversationId) { setBotId(INITIAL_VALUES.default_chatbot.id) }
            if (isConversationChange) {
                try {
                    await fetch(`${CONVERSATION_ENDPOINT}/${conversationId}`,
                        {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${storedToken}`,
                            },
                        })
                        .then((res) => {
                            if (res.ok) {
                                res.json().then((data) => {
                                    setMessages(data.messages as Array<IMessage>)
                                    setBotId(data.botId)
                                })
                            }
                        }).finally(() => {
                            setLoading(false)
                            setIsConversationChange(false)
                        })
                } catch (error) {
                }
            }
        }
        fetchConversation()
    }, [storedToken, conversationId, isConversationChange])
    return { botId, setBotId, loading }
}