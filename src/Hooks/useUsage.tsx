import { useState, useEffect, useContext } from 'react';
import { HOST } from '../constants';
import { AppContext } from '../Contexts/AppContext';
import { SupabaseContext } from '../Contexts/SupabaseContext';

export interface IUsage {
    n_chatbots: number,
    n_sources: number,
    n_messages: number,
    n_tokens: number,
    user_id: string
}

export interface IAccount {
    usage: IUsage,
    user_group: string
}

export default function useAccount() {
    const { session } = useContext(SupabaseContext)
    const { storedToken, setMsgs, msgs } = useContext(AppContext) 
    const [fetchingAccount, setFetchingAccount] = useState(false)
    const [authErr, setAuthErr] = useState(200)
    const [credits, setCredits] = useState<number>(0)
    const [userGroup, setUserGroup] = useState('free')
    const [usage, setUsage] = useState<IUsage>({
        n_chatbots: 0,
        n_sources: 0,
        n_messages: 0,
        n_tokens: 0,
        user_id: ''
    })

    useEffect(() => {
        const AUTH_API = `${HOST}/v1/usage`
        async function authToken() {
            if (!storedToken || !session) { return }
            setFetchingAccount(true)
            try {
                await fetch(AUTH_API,
                    { method: 'GET', headers: { Authorization: `Bearer ${storedToken}`, }, })
                    .then((res) => {
                        if (res.ok) {
                            res.json().then((data) => {
                                const usage: IUsage = data.usage
                                setUsage(usage)
                                setCredits(usage.n_messages)
                                setUserGroup(data.user_group)
                                setTimeout(() => {
                                    setFetchingAccount(false)
                                }, 500)
                            })
                        }
                        else {
                            setMsgs([...msgs, { type: 'error', 'message': 'Error fetching account details', 'duration': 2000}])
                            setAuthErr(res.status)
                            setFetchingAccount(false)
                        }
                    }).finally(() => {
                        setFetchingAccount(false)
                    }
                )
            } catch (error) {
                setMsgs([...msgs, { type: 'error', 'message': 'Error fetching account details', 'duration': 2000}])
                setAuthErr(500)
                setFetchingAccount(false)
             }
        }
        authToken()
    }, [storedToken])

    return { fetchingAccount, authErr, credits, setCredits, userGroup, usage }
}