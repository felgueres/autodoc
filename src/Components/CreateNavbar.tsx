import { cloneElement, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { HOST, Icons } from "../constants";
import { AppContext } from "../Contexts/AppContext";
import { MetadataKeys } from "./AssistantSettings";
import { IBot } from "../Hooks/useChatbots";
import { postToEndpoint } from "../Utils/Utils";

import { InputType } from "../Views/ChatbotEditor";
import { typeToInputTypeMap } from "../Views/ChatbotEditor";
import { TemplateContext } from "../Contexts/TemplateContext";

interface ICreateNavbar {
    inputType: InputType
    mode: 'new' | 'edit'
}

export default function CreateNavbar({ inputType, mode }: ICreateNavbar) {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { setMsgs, msgs, name, description, reset, visibility, sources, temperature, setTriggerBotsRefresh, modelId, system_message, starterMessage, suggest_messages, include_references } = useContext(AppContext)
    const { template } = useContext(TemplateContext)
    const navigate = useNavigate()
    const { botId } = useParams()

    useEffect(() => { if (mode === 'edit' && !botId) { navigate('/') } }, [botId, mode, navigate])

    const handleCreate = async () => {
        if (!name) return alert('Please enter a name for the chatbot')
        if (!sources.length) return alert('Please select at least one data source for the chatbot')
        const NEW_CHATBOT_ENDPOINT = `${HOST}/v1/bot/new`
        await postToEndpoint(NEW_CHATBOT_ENDPOINT, {
            name: name,
            description: description,
            sources: sources.map((source) => source.source_id),
            temperature: temperature,
            model_id: modelId,
            system_message: system_message,
            metadata: {
                [MetadataKeys.START_MESSAGE]: starterMessage,
                [MetadataKeys.SUGGEST_MESSAGES]: suggest_messages,
                [MetadataKeys.INCLUDE_REFERENCES]: include_references
            },
            visibility: visibility
        }, 'POST', storedToken).then((res) => {
            const bot = res.bot as IBot
            if (bot) {
                setTriggerBotsRefresh(true)
                navigate(`/documents/${bot.id}`, { replace: true })
                reset()
            }
        })
    }

    const handleUpdate = async () => {
        if (!name) return alert('Please enter a name for the chatbot')
        if (!sources.length) return alert('Please select at least one data source for the chatbot')
        const UPDATE_CHATBOT_ENDPOINT = `${HOST}/v1/bot/${botId}`
        await fetch(UPDATE_CHATBOT_ENDPOINT, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                sources: sources.map((source) => source.source_id),
                temperature: temperature,
                model_id: modelId,
                system_message: system_message,
                metadata: {
                    [MetadataKeys.START_MESSAGE]: starterMessage,
                    [MetadataKeys.SUGGEST_MESSAGES]: suggest_messages,
                    [MetadataKeys.INCLUDE_REFERENCES]: include_references
                },
                visibility: visibility
            })
        }).then((res) => {
            if (res.ok) {
                setTriggerBotsRefresh(true)
                navigate(`/documents/${botId}`, { replace: true })
            }
            else {
                setMsgs([...msgs, { type: 'error', message : 'Something went wrong. Please try again.' , duration: 2000}])
            }
        })
    }

    const handleDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete this assistant?') 
        if (!confirm) return
        const DELETE_CHATBOT_ENDPOINT = `${HOST}/v1/bot/${botId}`
        await fetch(DELETE_CHATBOT_ENDPOINT, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        }).then((res) => {
            if (res.ok) {
                setTriggerBotsRefresh(true)
                setMsgs([...msgs, { type: 'success', message : 'Assistant deleted successfully.' , duration: 2000}])
                navigate(`/`, { replace: true })
            }
            else {
                setMsgs([...msgs, { type: 'error', message : 'Something went wrong. Please try again.' , duration: 2000}])
            }
        })
    }

    const handleCancel = () => {
        if (sources.length) {
            const confirm = window.confirm('Are you sure you want to cancel? All your progress will be lost.')
            if (!confirm) return
            reset()
            navigate('/')
        } else {
            reset()
            navigate('/')
        }
    }

    return <div className="bg-white border-b px-4 py-3">
        <nav className="flex items-center justify-between bg-white mx-auto">
            <div className="flex cursor-pointer justify-center items-center gap-2 rounded-full w-10 h-10 border border-gray-300 bg-gray-50" onClick={handleCancel}>
                {cloneElement(Icons.arrow_back, { className: 'w-5 h-5' })}
            </div>
            <div className="sm:flex items-center justify-center hidden flex-1">
                <h1 className="text-2xl font-bold">
                    {mode === 'new' ? `Create Document ` : 'Edit'}
                </h1>
            </div>
            <div className="flex items-center w-auto gap-3">
                {mode === 'edit' && <button onClick={handleDelete} className="px-5 py-2 rounded-md flex items-center gap-2 hover:bg-red-500 hover:text-white">
                    <span>Delete</span>
                </button>}
                <button disabled={!sources?.length}
                    onClick={mode==='new'?handleCreate:handleUpdate} className={`px-5 py-2 bg-indigo-500 text-white rounded-md flex items-center gap-2 hover:bg-indigo-600 ${!sources.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    { mode === 'new' ? `Continue` : 'Update' }
                </button>
            </div>
        </nav>
    </div>
}
