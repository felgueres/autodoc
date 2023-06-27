import { cloneElement, useContext, useEffect, useRef, useState } from "react";
import { Icons, MAX_FILE_SIZE } from "../constants";
import useUpload from "../Hooks/useUpload";
import { AppContext } from "../Contexts/AppContext";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { Document, Page, pdfjs } from "react-pdf";
import useImage from "../Hooks/useImage";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const LoadingBar = ({ loading, processing, uploadProgress }: { loading: boolean, processing: boolean, uploadProgress: number }) => {
    const barRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (barRef.current && uploadProgress > 0) {
            barRef.current.style.width = `${uploadProgress}%`
        }
    }, [uploadProgress])

    if (loading) {
        return <div className="sm:w-1/2 mx-auto mt-5">
            <p className="text-sm"> {`Preparing source... ${uploadProgress}%`} </p>
            <div className="bg-gray-300 rounded-sm overflow-hidden h-4">
                { uploadProgress > 0 && <div ref={barRef} className="bg-indigo-500 h-4"></div> }
            </div>
        </div>
    } else if (processing) {
        return <div className="sm:w-1/2 mx-auto mt-5">
            <p className="text-sm"> Processing source... 1 minute remaining.</p>
            <div className="bg-gray-300 rounded-sm overflow-hidden">
                <div className="bg-indigo-500 h-4 animate-flow-loading"></div>
            </div>
        </div>
    }
    else {
        return null
    }
}

function bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}

function FileStats() {
    const { sources, file } = useContext(AppContext)
    if (!sources.length || !file) return null
    return <>
        <div className=" self-start px-4">
            <span className="text-xs text-gray-500"> Filename </span>
            <p className="text-sm overflow-hidden text-ellipsis"> {file.name} </p>
            <span className="text-xs text-gray-500"> File size </span>
            <p className="text-sm"> {bytesToSize(file.size)} </p>
            <span className="text-xs text-gray-500"> Model tokens </span>
            <p className="text-sm overflow-hidden text-ellipsis"> {sources[0].n_tokens} </p>
        </div>
    </>
}

function Thumbnail() {
    const { file } = useContext(AppContext)
    const [error, setError] = useState<boolean>(false)
    if (!file) return null

    if (error) {
        return (
            <div className="items-center flex-col bg-gray-50 rounded-sm py-4 gap-4">
                <div className="flex items-center justify-center">
                    {cloneElement(Icons.error, { className: 'w-10 h-10' })}
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-500"> Image unavailable </p>
                </div>
            </div>
        )
    }

    return (
        <div className="border">
            <Document onLoadError={() => setError(true)} file={file}>
                <Page width={220} scale={1} renderAnnotationLayer={false} renderTextLayer={false} pageNumber={1} />
            </Document>
        </div>
    )
}

export function FileSummary() {
    const { file, sources } = useContext(AppContext)
    if (!file || !sources.length) return null
    return (
        <>
            <div className="border flex items-center flex-col bg-gray-50 rounded-sm py-4 gap-4">
                <Thumbnail />
                <FileStats />
            </div>
        </>
    );
};

export function WebSummary() {
    const { sources } = useContext(AppContext)
    const sourceId = sources[0]?.source_id
    const { imgURL } = useImage({ sourceId })
    if (!sources.length) return null
    return (
        <>
            <div className="border flex items-center flex-col bg-gray-50 rounded-sm py-4 gap-4">
                <div className="border">
                    {
                        imgURL ? <img src={imgURL} alt="web data" className="w-52 h-52 object-cover" /> :
                            <div className="flex items-center justify-center">
                                {cloneElement(Icons.error, { className: 'w-10 h-10' })}
                            </div>
                    }
                </div>
                <WebStats />
            </div>
        </>
    );
}

export function VideoSummary() {
    const { sources } = useContext(AppContext)
    if (!sources.length) return null
    return (
        <>
            <div className="border flex items-center flex-col bg-gray-50 rounded-sm py-4 gap-4">
                <VideoStats />
            </div>
        </>
    );
}

function VideoStats() {
    const { sources } = useContext(AppContext)
    const source = sources[0]
    if (!sources.length || !source) return null
    return <>
        <div className="self-start px-4  max-w-xs">
            <span className="text-xs text-gray-500"> Video </span>
            <p className="text-sm overflow-hidden text-ellipsis max-w-full"> {source.name} </p>
            <span className="text-xs text-gray-500"> Model tokens </span>
            <p className="text-sm overflow-hidden text-ellipsis"> {sources[0].n_tokens} </p>
        </div>
    </>
}

function WebStats() {
    const { sources } = useContext(AppContext)
    const source = sources[0]
    if (!sources.length || !source) return null
    return <>
        <div className="self-start px-4  max-w-xs">
            <span className="text-xs text-gray-500"> Website </span>
            <p className="text-sm overflow-hidden text-ellipsis max-w-full"> {source.name} </p>
            <span className="text-xs text-gray-500"> Model tokens </span>
            <p className="text-sm overflow-hidden text-ellipsis"> {sources[0].n_tokens} </p>
        </div>
    </>
}

export default function FileUploader() {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { msgs, setMsgs, isUpload, setName, setIsUpload, setNewDataHash, sources, setSources, file, setFile } = useContext(AppContext)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const { loading, processing, error, userData } = useUpload({
        storedToken, file, isUpload, setIsUpload, setNewDataHash,
        onProgress: (ProgressEvent: ProgressEvent) => {
            const progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
            setUploadProgress(progress)
        }
    })

    useEffect(() => {
        if (userData) { setSources([...sources, userData]) }
    }, [userData])

    useEffect(() => {
        if (isUpload) {
            setIsUpload(false)
            setMsgs([...msgs, { message: 'Data uploaded successfully', type: 'success', duration: 2000 }])
            setName(file?.name.split('.')[0] || '')
        }
    }, [isUpload])

    function handlePDFInput() {
        const pdfInput = document.getElementById('pdfInput')
        pdfInput?.click()
    }

    function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
        const pdfFileInput = event.target.files?.[0]
        if (!pdfFileInput) return null
        if (pdfFileInput?.size > MAX_FILE_SIZE) {
            alert(`File size too large. ${MAX_FILE_SIZE / 1000000}MB max.`)
            event.target.value = ''
        } else {
            setFile(pdfFileInput)
        }
    }

    if (sources.length) { return null }

    return <div className="bg-gray-50 py-10 h-60 flex flex-col justify-center gap-3">
        {(loading || processing) ? null : <>
            <button onClick={handlePDFInput} className="mx-auto border px-5 py-3 flex items-center rounded-md gap-2 bg-indigo-500 text-white">
                {cloneElement(Icons.upload, { className: 'w-5 h-5 fill-current' })}
                Upload PDF document
            </button>
            <small className="text-gray-500 text-center"> Max file size: 10Mb </small>
            <input className='hidden' onChange={handleFile} type="file" accept=".pdf" required name='inputFile' id="pdfInput" />
        </>}
        <LoadingBar loading={loading} processing={processing} uploadProgress={uploadProgress} />
    </div>
}