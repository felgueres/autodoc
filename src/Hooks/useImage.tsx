import { useEffect, useContext, useState } from 'react';
import { HOST } from '../constants';
import { SupabaseContext } from '../Contexts/SupabaseContext';
import { AppContext } from '../Contexts/AppContext';

interface IUsePDF {
    sourceId: string,
}

export default function useImage({ sourceId }: IUsePDF) {
    const { storedToken } = useContext(AppContext)
    const [imgURL, setImgURL] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const FILE_ENDPOINT = `${HOST}/v1/file`
        async function fetchFile() {
            if (!storedToken || !sourceId) { return }
            setLoading(true)
            try {
                await fetch(`${FILE_ENDPOINT}/${sourceId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    })
                    .then((res) => {
                        if (res.ok && res.body) {
                            const reader = res.body.getReader()
                            const chunks: Uint8Array[] = [];
                            reader.read().then(function processResult(result): any {
                                if (result.done) {
                                    const blob = new Blob(chunks, { type: 'image/png' })
                                    const url = URL.createObjectURL(blob)
                                    setImgURL(url)
                                    return;
                                }
                                chunks.push(result.value);
                                return reader.read().then(processResult);
                            });
                        }
                    }
                    )
                    .finally(() => {
                        setLoading(false)
                    }
                    )
            } catch (error) {
            }
            
        }
        fetchFile()
    }, [storedToken, sourceId])
    return { loading, imgURL }
}