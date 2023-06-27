import { useContext } from "react"
import { AppContext } from "../Contexts/AppContext"
import useImage from "../Hooks/useImage"

export default function WebViewer() {
    const { chatbot } = useContext(AppContext)
    const sourceId = chatbot?.sources[0].source_id
    const { loading, imgURL } = useImage({ sourceId })

    if (loading || !imgURL) return (<div className="flex flex-col items-center justify-center ">
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900"></div>
            <h1 className='text-xl font-bold mt-3'>Loading</h1>
        </div>
    </div>
    )

    return <>
        <div className="flex flex-col items-center justify-center ">
            {<img src={imgURL} alt="webviewer" className="" />}
        </div>
    </>
}
