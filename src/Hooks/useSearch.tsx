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

export type TFacts = {
    [key: string]: {
        value: string,
        page_number: number,
    } | null
}



interface IExtractRequest {
    template_id: string,
    source_id: string,
    field_idx: number,
}

export default function useExtract() {
    const { storedToken, chatbot, template } = useContext(AppContext)
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [facts, setFacts] = useState<TFacts | null>(null);
    const { msgs, setMsgs } = useContext(AppContext)

    useEffect(() => {
        async function fetchFacts() {
            if (!isSubmit || !template || !chatbot) { return }
            // setLoading(true)

            const requestsArr = template.fields.map((_, i) => {
                const body: IExtractRequest = {
                    "template_id": template.template_id as string,
                    "source_id": chatbot.sources[0].source_id,
                    "field_idx": i,
                }
                return body
            })
    
            try {
                for (const field of requestsArr) {
                    const res = await fetch(SEARCH_API, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${storedToken}`
                        },
                        body: JSON.stringify(field),
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        const { data: {field, value, page_number } } = data
                        setFacts((prevFacts) => ({ ...prevFacts, [field]: { value, page_number }}));
                    } else {
                        console.log('Error:', res.status);
                    }
                }
            } catch (error) {
                console.log(error);
            }

            setIsSubmit(false)
            setLoading(false)
        }

        fetchFacts()

    }, [isSubmit])
    return { loading, facts, setFacts, setIsSubmit }
}