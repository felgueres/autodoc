import { useContext, useEffect, useState } from "react"
import usePreflight from "../Hooks/usePreflight";
import { isValidUrl } from "../Utils/Utils";
import { AppContext } from "../Contexts/AppContext";
import { LoadingBar } from "./FileUploader";

export default function YTUploader() {
    const { sources, setSources, setNewDataHash } = useContext(AppContext)
    const [url, setUrl] = useState('')
    const [checkPreflight, setCheckPreflight] = useState(false)
    const sourceType = 'video'
    const { userData, loading, setError, processing, uploadProgress } = usePreflight({ url, checkPreflight, setCheckPreflight, setNewDataHash, sourceType })

    useEffect(() => {
        if (userData) { 
            setSources([...sources, userData]) 
        }
    }, [userData])

    function isValidYoutubeUrl(url: string) {
        const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/g
        return regex.test(url)
    }

    const handleNewUrl = () => {
        setError(null)
        if (!url) { alert('Please enter a URL'); return null }
        if (!isValidUrl(url)) { alert('Looks like the URL is invalid, try typing it in full again.'); return null }
        if (!isValidYoutubeUrl(url)) { alert('Please enter a valid Youtube URL'); return null }
        setCheckPreflight(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
    }

    if (sources.length) return null

    return <>
        <div className="bg-gray-100 px-5 py-10  h-60 flex flex-col justify-center text-base">
            {(loading || processing) ? null : <>
                <div className="w-1/2 mx-auto flex flex-col gap-3">
                    <form onSubmit={(e) => { e.preventDefault(); handleNewUrl() }} className="flex flex-col gap-3">
                        <input id="urlInput" type="text" required className="flex flex-1 border rounded-sm px-2 py-3" value={url} placeholder="Paste Youtube URL here..." onChange={handleInputChange} onSubmit={handleNewUrl} />
                        <button disabled={loading} className={`flex-shrink-0 bg-indigo-500 text-white py-3 px-2 rounded-sm ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleNewUrl}>
                            {loading ? <>
                                <div className="flex justify-center items-center">
                                    <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                </div>
                            </> : <>Fetch video</>}
                        </button>
                        <small className="text-gray-500 text-center">
                            Max video length: 10 minutes 
                        </small>
                    </form>
                </div>
            </>
            }
            <LoadingBar loading={loading} processing={processing} uploadProgress={uploadProgress} />
        </div>
    </>
}