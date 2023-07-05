import { useState, useEffect, useContext } from 'react'
import { HOST } from '../constants';
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

export type TFacts = Record<string, { value: string, page_number: number, }>

interface IExtractRequest {
    template_id: string,
    source_id: string,
    field_idx: number,
}

export default function useExtract({ field_idx }: { field_idx: number }) {
    // field_idx = -1 means extract all fields
    const { storedToken, chatbot, template, facts, setFacts } = useContext(AppContext)
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchFact() {
            if (!isSubmit || !template || !chatbot || field_idx < 0) { return }
            setLoading(true)

            const field: IExtractRequest = {
                "template_id": template.template_id as string,
                "source_id": chatbot.sources[0].source_id,
                "field_idx": field_idx,
            }

            await fetch(SEARCH_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify(field),

            }).then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        const { data: { field, value, page_number } } = data
                        const record = { [field]: { value, page_number } } as TFacts
                        setFacts({ ...facts, ...record })
                    })
                }
            })
            setIsSubmit(false)
            setLoading(false)
        }
        fetchFact()
    }, [isSubmit])

    useEffect(() => {
        async function fetchFacts() {
            if (!isSubmit || !template || !chatbot || field_idx >= 0) { return }
            setLoading(true)
            const requestsArr = template.fields.map((_, i) => {
                const body: IExtractRequest = {
                    "template_id": template.template_id as string,
                    "source_id": chatbot.sources[0].source_id,
                    "field_idx": i,
                }
                return body
            })

            const requests = requestsArr.map((field) => {
                return fetch(SEARCH_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify(field),
                }).then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        return null;
                    }
                })
            })

            try {
                const resolvers = await Promise.all(requests)

                const records = resolvers.map((res) => {
                    if (res) {
                        const { data: { field, value, page_number } } = res
                        const fact = { [field]: { value, page_number } } as TFacts
                        return fact

                    } else {
                        return {}
                    }
                }
                )
                setFacts({ ...facts, ...records.reduce((acc, cur) => ({ ...acc, ...cur }), {}) })
            }

            catch (err) {
                console.log(err)
            }

            setIsSubmit(false)
            setLoading(false)
        }

        fetchFacts()

    }, [isSubmit])

    return { loading, setIsSubmit, facts, setFacts }
}