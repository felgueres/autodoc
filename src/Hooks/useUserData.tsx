import { useState, useEffect } from 'react';
import { HOST } from '../constants';

export type TUserData = {
    source_id: string,
    name: string,
    dtype: string,
    created_at: string,
    status: string,
    n_tokens: number,
}

export default function useUserData(storedToken: string, processHash: string) {
    const [userData, setUserData] = useState<Array<TUserData>>([]) 
    useEffect(() => {
        const UPLOAD_ENDPOINT = `${HOST}/user_data`
        async function fetchUpload() {
            if (!storedToken) { return }
            try {
                await fetch(`${UPLOAD_ENDPOINT}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    })
                    .then((res) => {
                        if (res.ok) {
                            res.json().then((data) => {
                                setUserData(data.user_data as Array<TUserData>)
                            })
                        }
                    })
            } catch (error) {
            }
        }
        fetchUpload()
    }, [storedToken, processHash ])

    return { userData, setUserData }
}