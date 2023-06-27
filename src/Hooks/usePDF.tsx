import { useEffect, useContext, useState } from 'react';
import { HOST } from '../constants';
import { AppContext } from '../Contexts/AppContext';

interface IUsePDF {
    sourceId: string,
}

export default function usePDF({ sourceId }: IUsePDF) {
    const { storedToken } = useContext(AppContext)
    const [pdfURL, setPdfURL] = useState<string>('')

    useEffect(() => {
        const UPLOAD_ENDPOINT = `${HOST}/v1/file`
        async function fetchFile() {
            if (!storedToken) { return }
            try {
                await fetch(`${UPLOAD_ENDPOINT}/${sourceId}`,
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
                                    const blob = new Blob(chunks, { type: 'application/pdf' })
                                    const url = URL.createObjectURL(blob)
                                    setPdfURL(url)
                                    return;
                                }
                                chunks.push(result.value);
                                return reader.read().then(processResult);
                            });
                        }
                    }
                    )
            } catch (error) {
            }
        }
        fetchFile()
    }, [storedToken])

    return { pdfURL }
}