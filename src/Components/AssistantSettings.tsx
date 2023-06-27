import { useContext } from "react"
import { IMessage } from "./Chat"
import { AppContext } from "../Contexts/AppContext"

export enum MetadataKeys {
    START_MESSAGE = 'start_message',
    SUGGEST_MESSAGES = 'suggest_messages',
    INCLUDE_REFERENCES = 'include_references'
}

export type TMetadata = {
    [MetadataKeys.START_MESSAGE]: IMessage,
    [MetadataKeys.SUGGEST_MESSAGES]: string,
    [MetadataKeys.INCLUDE_REFERENCES]: boolean
}

export default function AssistantSettings() {
    const { sources, name, setName, description, setDescription, setStarterMessage, starterMessage, suggest_messages, setSuggestMessages } = useContext(AppContext)
    if (sources.length === 0) return (<></>)

    return <>
        <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Title</span>
            <input
                type="text"
                value={name}
                maxLength={180}
                onChange={(event) => setName(event.target.value)}
                className="resize-y border rounded p-2 text-sm w-full h-12"
                placeholder="Add a title that describes your content..."
            />
{/* 
            <span className="font-semibold text-gray-700 mt-4">Description</span>
            <input
                type="text"
                value={description}
                maxLength={180}
                onChange={(event) => setDescription(event.target.value)}
                className="resize-y border rounded p-2 text-sm w-full h-12"
                placeholder="Tell users about your content..."
            />

            <span className="font-semibold text-gray-700 mt-4">Welcome message</span>
            <span className="text-sm text-gray-500">Add your assistant's first message</span>
            <div className='flex flex-1 flex-col w-full h-full gap-1 overflow-hidden overflow-y-auto'>
                <input
                    type="text"
                    value={starterMessage.content}
                    onChange={(event) => setStarterMessage({ ...starterMessage, content: event.target.value })}
                    className="resize-y border rounded p-2 text-sm w-full h-12"
                    placeholder="Name"
                />
            </div> */}
            {/* <span className="font-semibold text-gray-700 mt-4">Template questions</span>
            <span className="text-sm text-gray-500">Enter questions</span>
            <div className='flex flex-1 flex-col w-full h-full gap-1 overflow-hidden overflow-y-auto'>
                <textarea
                    value={suggest_messages}
                    onChange={(event) => setSuggestMessages(event.target.value)}
                    className="resize-y border rounded p-2 text-sm w-full h-20"
                    placeholder="Add messages separated by new lines"
                />
            </div> */}
        </div>
    </>
}