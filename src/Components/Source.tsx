import { useContext } from "react"
import { AppContext } from "../Contexts/AppContext"
import PDFViewer from "./PDFViewer"
import { InputType, typeToInputTypeMap } from "../Views/ChatbotEditor"
import WebViewer from "./WebViewer"
import YTViewer from "./YoutubeViewer"

export default function Source() {
    const { chatbot } = useContext(AppContext)
    if (!chatbot) { return null }
    const source = chatbot?.sources[0]
    const inputType = typeToInputTypeMap[source?.dtype as InputType]

    const renderInput = () => {
        switch (inputType) {
            case InputType.File:
                return <PDFViewer />
            case InputType.Video:
                return <YTViewer />
            case InputType.Web:
                return <WebViewer />
            default:
                return null
        }
    }

    return <>
        <div className="flex flex-col overflow-hidden overflow-y-auto">
            {renderInput()}
        </div>
    </>
}