import { useContext, useEffect, useState } from 'react';
import { HOST } from '../constants';
import { SupabaseContext } from '../Contexts/SupabaseContext';
import { TUserData } from './useUserData';
import { checkFileProcessing } from './useUpload';
import { AppContext } from '../Contexts/AppContext';

interface IPreflight {
    url: string,
    checkPreflight: boolean,
    setCheckPreflight: (checkPreflight: boolean) => void
    setNewDataHash: (newDataHash: string) => void
    sourceType: string
}

type TError = {
    reason: string
    code: number
}

type TResponse = {
    upload_success: boolean
    source_id: string
    name: string
    error: string
}

export default function usePreflight({ url, checkPreflight, setCheckPreflight, setNewDataHash, sourceType }: IPreflight) {
    const { session } = useContext(SupabaseContext)
    const { msgs, setMsgs, setName } = useContext(AppContext)
    const storedToken = session?.access_token
    const [error, setError] = useState<TError | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [processing, setProcessing] = useState<boolean>(false)
    const [userData, setUserData] = useState<TUserData | null>(null)
    const [uploadProgress, setUploadProgress] = useState<number>(0)

    useEffect(() => {
        const PREFLIGHT_ENDPOINT = `${HOST}/v1/source/create`
        async function fetchPreflightLinks() {

            if (!url || !checkPreflight || !storedToken) { return }

            setLoading(true)
            // simulate progress bar from 0 to 100, on 100

            const intervalId = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev < 99) {
                        return prev + 1
                    }
                    return prev
                })
            }, 1000)

            try {
                await fetch(`${PREFLIGHT_ENDPOINT}`,
                    {
                        method: 'POST',
                        body: JSON.stringify({ url, source_type: sourceType }),
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                    .then((res) => {
                        if (res.ok) {
                            res.json().then((d) => {
                                const data = d as TResponse
                                if (data.error){
                                    setMsgs([...msgs, { message: data.error, type: 'error', duration: 5000 }])
                                    setError({ reason: 'Bad Request', code: 400 })
                                }
                                if (data.upload_success) {
                                    setMsgs([...msgs, { message: `${sourceType} fetched!`, type: 'success', duration: 2000 }])
                                    setProcessing(true)
                                    checkFileProcessing({
                                        setNewDataHash,
                                        msgs,
                                        setMsgs,
                                        setUserData,
                                        setProcessing,
                                        sourceId: data.source_id,
                                        storedToken
                                    })
                                    setUploadProgress(100)
                                    setName(data.name)
                                } 
                            })
                        }
                        else {
                            res.json().then((d) => {
                            setMsgs([...msgs, { message: d.error, type: 'error', duration: 5000 }])
                            setError({ reason: 'Bad Request', code: 400 })
                            })
                        }
                    })
                    .finally(() => {
                        setLoading(false)
                        setCheckPreflight(false)
                        setUploadProgress(0) 
                        clearInterval(intervalId)
                    }
                    )
            } catch (error) {
                setError({ reason: 'Service unavailable', code: 503 })
                setLoading(false)
                setCheckPreflight(false)
            }
        }
        fetchPreflightLinks()

    }, [checkPreflight, url])
    return { userData, error, loading, setError, processing, uploadProgress }
}