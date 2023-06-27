import { useState, useEffect } from 'react';
import { HOST } from '../constants';

type History = {
    history: Array<Record<string, any>>
}

const HISTORY_LIMIT = 10

export default function useHistory(storedToken: string, curConversationId: string) {

    const [history, setHistory] = useState<History['history']>([]) 

    useEffect(() => {
        const HISTORY_ENDPOINT = `${HOST}/v1/history`
        async function fetchCredits() {
            if (!storedToken) { setHistory([]); return } 
            try {
                await fetch(`${HISTORY_ENDPOINT}?limit=${HISTORY_LIMIT}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    })
                    .then((res) => {
                        if (res.ok) {
                            res.json().then((data) => {
                                setHistory(data.history)
                            })
                        }
                    })
            } catch (error) {
            }
        }
        fetchCredits()
    }, [storedToken, curConversationId])

    return { history }
}