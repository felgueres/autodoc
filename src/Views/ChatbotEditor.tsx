import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { AppContext } from "../Contexts/AppContext";
import CreateNavbar from "../Components/CreateNavbar";
import FileUploader, { FileSummary, VideoSummary, WebSummary } from "../Components/FileUploader";
import AssistantSettings from "../Components/AssistantSettings";
import { MetadataKeys } from "../Components/AssistantSettings";
import URLUploader from "../Components/WebUploader";
import YTUploader from "../Components/YTUploader";
import useChatBots, { IBot } from "../Hooks/useChatbots";
import NotFoundPage from "./Notfound";

interface IChatbotEditor {
    mode: 'new' | 'edit',
    chatbot?: IBot
}

export enum InputType {
    File = 'pdf',
    Web = 'url',
    Video = 'video',
    Template = 'template',
    Default = 'default'
}

export const typeToInputTypeMap = {
    [InputType.File]: InputType.File,
    [InputType.Web]: InputType.Web,
    [InputType.Video]: InputType.Video,
    [InputType.Template]: InputType.Template,
    [InputType.Default]: InputType.Default
}

export default function ChatbotEditor({ mode }: IChatbotEditor) {
    const { session } = useContext(SupabaseContext)
    const { sources, visibility, setSources, setVisibility, description, setDescription, name, setName, setChatbot, temperature, system_message, modelId, suggest_messages, include_references, setTemperature, setSystemMessage, starterMessage, setStarterMessage, setSuggestMessages, setIncludeReferences } = useContext(AppContext)
    const storedToken = session?.access_token
    const [inputType, setInputType] = useState<InputType>(InputType.Default)
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type')
    const { botId } = useParams<{ botId?: string }>();
    const { bot, notFound } = useChatBots({ storedToken, botId, 'type': 'bots'})
    const navigate = useNavigate()

    useEffect(() => {
        const inputType = typeToInputTypeMap[type as InputType]
        if (mode === 'new') {
            if (inputType) {
                setInputType(typeToInputTypeMap[type as InputType])
            }
            else { navigate('/') }
        }
    }, [type])

    useEffect(() => {
        if (mode === 'edit' && botId) {
            if (bot) {
                setTemperature(bot.temperature)
                setSystemMessage(bot.system_message)
                setName(bot.name)
                setDescription(bot.description)
                setSources(bot.sources)
                setStarterMessage(bot.metadata[MetadataKeys.START_MESSAGE])
                setSuggestMessages(bot.metadata[MetadataKeys.SUGGEST_MESSAGES])
                setIncludeReferences(bot.metadata[MetadataKeys.INCLUDE_REFERENCES])
                setVisibility(bot.visibility as 'public' | 'private')
            }
        }
    }, [botId, mode, bot])

    useEffect(() => {
        if (mode === 'new') {
            setChatbot({
                id: botId ? botId : 'default1',
                name: name,
                description: description,
                sources: sources,
                temperature: temperature,
                system_message: system_message,
                model_id: modelId,
                created_at: '',
                metadata: {
                    [MetadataKeys.START_MESSAGE]: starterMessage,
                    [MetadataKeys.SUGGEST_MESSAGES]: suggest_messages,
                    [MetadataKeys.INCLUDE_REFERENCES]: include_references
                },
                visibility: visibility
            })
        }
    }, [botId, name, description, sources, temperature, system_message, modelId, starterMessage, suggest_messages, include_references])

    const renderInput = () => {
        switch (inputType) {
            case InputType.File:
                return <FileUploader />
            case InputType.Video:
                return <YTUploader />
            case InputType.Web:
                return <URLUploader />
            default:
                return null
        }
    }

    const renderSourcePreview = () => {
        switch (inputType) {
            case InputType.File:
                return <FileSummary />
            case InputType.Video:
                return <VideoSummary />
            case InputType.Web:
                return <WebSummary />
            default:
                return null
        }
    }

    if(notFound) return <NotFoundPage />

    return <div className="h-full w-full text-black overflow-y-auto">
        <div className="flex flex-col h-full">
            <CreateNavbar inputType={inputType} mode={mode} />
            <div className="w-full sm:max-w-[900px] mx-auto h-full pt-4 p-2 flex flex-col">
                {renderInput()}
                <div className="flex flex-col sm:flex-row mt-2 gap-5">
                    <div className="sm:w-3/5">
                        <AssistantSettings />
                    </div>
                    <div className="sm:w-2/5">
                        {renderSourcePreview()}
                    </div>
                </div>
            </div>
            <div className="h-[100px] flex shrink-0"></div>
        </div >
    </div>
}