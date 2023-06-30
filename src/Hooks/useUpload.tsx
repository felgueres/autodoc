import { useContext, useEffect, useState } from 'react';
import { HOST } from '../constants';
import { AppContext } from '../Contexts/AppContext';
import { TUserData } from './useUserData';
import { TToast } from '../Utils/Utils';

interface IUpload {
    isUpload: boolean
    setIsUpload: (isUpload: boolean) => void
    file: File | null
    storedToken: string
    setNewDataHash: (newDataHash: string) => void
    onProgress: (ProgressEvent: ProgressEvent) => void
}

export function generateHash(length: number) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let retVal = ''
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
    }
    return retVal
}

interface ICheckFileProcessing {
    setUserData: (userData: TUserData | null) => void
    setNewDataHash: (newDataHash: string) => void
    setProcessing: (processing: boolean) => void
    sourceId: string
    retries?: number
    msgs: TToast[]
    setMsgs: (msgs: TToast[]) => void
    storedToken: string
}

const MAX_RETRIES = 30

export async function checkFileProcessing({ setUserData, setNewDataHash, setProcessing, sourceId, retries = 0, msgs, setMsgs, storedToken }: ICheckFileProcessing) {
    try {
        const response = await fetch(`${HOST}/v1/source/${sourceId}`, { method: 'GET', headers: { Authorization: `Bearer ${storedToken}`, }, })
        if (!response.ok) { throw new Error('Network response was not ok') }
        const data = await response.json()
        if (data.status === 'success') {
            setUserData(data)
            setNewDataHash(generateHash(3))
            setProcessing(false)
        } else if (data.status === 'notFound' || data.status === 'error' || retries >= MAX_RETRIES) {
            setMsgs([...msgs, { message: `File processed with errors.`, type: 'error', duration: 2000 }])
            setProcessing(false)
        } else if (retries < MAX_RETRIES) {
            setTimeout(() => checkFileProcessing({ setUserData, setNewDataHash, setProcessing, sourceId, retries: retries + 1, msgs, setMsgs, storedToken }), 5000)
        } else { }
    } catch (error) {
        setMsgs([...msgs, { message: `Error processing. Try again.`, type: 'error', duration: 2000 }])
    }
}

export default function useUpload({ setNewDataHash, storedToken, file, isUpload, setIsUpload, onProgress }: IUpload) {
    const [loading, setLoading] = useState<boolean>(false)
    const [processing, setProcessing] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const { msgs, setMsgs } = useContext(AppContext)
    const [userData, setUserData] = useState<TUserData | null>(null)

    useEffect(() => {
        const UPLOAD_ENDPOINT = `${HOST}/v1/file/upload`
        async function fetchUpload() {
            if (!storedToken) { return }
            if (!file) { return }
            setLoading(true)
            const formData = new FormData()
            formData.append('inputFile', file)
            const xhr = new XMLHttpRequest()
            xhr.upload.addEventListener('progress', onProgress)
            try {
                xhr.open('POST', `${UPLOAD_ENDPOINT}`)
                xhr.setRequestHeader('Authorization', `Bearer ${storedToken}`)
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const data = JSON.parse(xhr.response)
                        setIsUpload(data.upload_sucess)
                        setError(data.error)
                        setNewDataHash(data.source_id)
                        if (data.upload_sucess) {
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
                        }
                        if (data.error) {
                            setMsgs([...msgs, { message: data.error, type: 'error', duration: 5000 }])
                        }
                    } else {
                        setError('Error: Network Failed')
                    }
                }
                xhr.onerror = function () { 
                    setMsgs([...msgs, { message: 'Error: Network Failed', type: 'error', duration: 5000 }])
                }
                xhr.send(formData)

            } catch (error) {

            } finally {
                setLoading(false)
                setIsUpload(false)
            }
        }
        fetchUpload()
    }, [storedToken, file])

    return { isUpload, error, loading, processing, userData }
}