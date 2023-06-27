import { useState, useEffect, useContext } from 'react'
import { HOST } from '../constants';
import { TUserData } from './useUserData';
import { AppContext } from '../Contexts/AppContext';

const SEARCH_API = `${HOST}/v1/search`

export interface ISearch {
    query: string,
}

export type TReference = {
    id: string,
    title: string,
    text: string,
    score: number,
    n_tokens: number
}

export type TFacts = {
    facts: { [key: string]: string } | null,
}

interface IExtractRequest {
    upstream_version: string,
    chatbot_id: string,
    template_id: string,
    sources: TUserData[],
}


export default function useExtract() {
    const { storedToken, chatbot, template } = useContext(AppContext)
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [facts, setFacts] = useState<TFacts>({ facts: null, })
    const { msgs, setMsgs } = useContext(AppContext)

    console.log(facts)

    useEffect(() => {
        async function fetchFacts() {
            if (!isSubmit || !template || !chatbot) { return }
            let body: IExtractRequest = {
                "upstream_version": '0.3.5',
                "template_id": template.template_id as string,
                "chatbot_id": chatbot.id,
                "sources": chatbot.sources,
            }
            setLoading(true)
            await fetch(
                SEARCH_API,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify(body),
                }
            )
                .then((res) => {
                    if (res.ok) {
                        res.json().then((data) => {
                            const r = data as TFacts
                            const { facts } = r
                            setFacts({ facts })
                        })
                    }
                    else {
                        setMsgs([...msgs, { type: 'error', message: 'Network error. Try again.', duration: 2000 }])
                    }
                }
                ).finally(
                    () => {
                        setIsSubmit(false)
                        setLoading(false)
                    }
                )
        }
        fetchFacts()
        } , [isSubmit])
    return { loading, facts, setFacts, setIsSubmit }
}