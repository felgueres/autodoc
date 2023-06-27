import { useState, useEffect, useContext } from 'react';
import { HOST } from '../constants';
import { SupabaseContext } from '../Contexts/SupabaseContext';

type TReaction = {
    reaction: string,
    reaction_cnt: number,
    has_reacted: boolean
}

interface IUseReaction {
    botId: string | null
}

export default function useReaction({ botId }: IUseReaction) {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const [loading, setLoading] = useState(false)
    const [likes, setLikes] = useState<TReaction>({ reaction: 'like', reaction_cnt: 0, has_reacted: false }) 
    const [triggerRefresh, setTriggerRefresh] = useState(false)
    useEffect(() => {
        if (!botId || !storedToken) { return }
        const REACTION_ENDPOINT = `${HOST}/v1/post/${botId}/reactors` 
        async function reaction() {
            if (!storedToken) { return }
            setLoading(true)
            try {
                await fetch(`${REACTION_ENDPOINT}`,
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${storedToken}` }
                    })
                    .then((res) => {
                        if (res.ok) {
                            res.json().then((data) => {
                                if (data) {
                                    const res = data as TReaction
                                    setLikes(res)
                                } 
                            })
                        }
                    })
                    .finally(() => {
                        setLoading(false)
                    }
                    )
            } catch (error) {
            }
        }
        reaction()
    }, [triggerRefresh, botId, storedToken, setLikes])

    return { loading, likes, triggerRefresh, setTriggerRefresh }
}