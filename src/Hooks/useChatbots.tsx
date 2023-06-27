import { useState, useEffect } from 'react';
import { HOST } from '../constants';
import { TUserData } from './useUserData';
import { TMetadata } from '../Components/AssistantSettings';
import { TTemplate } from '../Contexts/TemplateContext';

export interface IBot {
    id: string,
    name: string,
    description: string,
    created_at: string,
    sources: Array<TUserData>
    model_id: string,
    system_message: string,
    temperature: number,
    metadata: TMetadata,
    visibility: string
}

interface IUseChatBots {
    storedToken: string | null,
    botId?: string | null,
    type: string
}

export default function useChatBots({ storedToken, botId, type }: IUseChatBots) {
    const [bots, setBots] = useState<IBot[]|null>(null)
    const [bot, setBot] = useState<IBot | null>(null)
    const [templates, setTemplates] = useState<TTemplate[] | null>(null)
    const [template, setTemplate] = useState<TTemplate | null>(null)
    const [triggerBotsRefresh, setTriggerBotsRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        // if botId, encode it in the endpoint
        const BOTS_ENDPOINT = botId ? `${HOST}/v1/${type}/${botId}` : `${HOST}/v1/${type}`
        async function fetchBots() {
            if (!storedToken) { return }
            setLoading(true)
            try {
                await fetch(`${BOTS_ENDPOINT}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    })
                    .then((res) => {
                        if (res.ok) {
                            res.json().then((data) => {
                                if (botId) {
                                    if (type === 'bots') {
                                        const newBot = data.bots[0] as IBot
                                        setBot(newBot)
                                        if (!newBot) {
                                            setNotFound(true)
                                        }
                                    } else {
                                        const newTemplate = data.templates[0] as TTemplate
                                        setTemplate(newTemplate as TTemplate)
                                        if (!newTemplate) {
                                            setNotFound(true)
                                        }
                                    }
                                } else {
                                    if (type === 'bots') {
                                        const newBots = data.bots as IBot[]
                                        setBots(newBots)
                                        if (!newBots) {
                                            setNotFound(true)
                                        }
                                    } else {
                                        const newTemplates = data.templates as TTemplate[]
                                        setTemplates(newTemplates)
                                        if (!newTemplates) {
                                            setNotFound(true)
                                        }
                                    }
                                }
                            })
                        }
                    })
                    .finally(() => {
                        setTriggerBotsRefresh(false)
                        setTimeout(() => {
                            setLoading(false)
                        } , 200)
                    }
                    )
            } catch (error) {
            }
        }
        fetchBots()
    }, [storedToken, triggerBotsRefresh, setBots, botId, setTemplate])

    return { loading, bot, setBot, bots, setBots, triggerBotsRefresh, setTriggerBotsRefresh, notFound, setNotFound, templates, setTemplates, template, setTemplate }
}