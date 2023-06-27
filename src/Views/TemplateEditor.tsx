import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { AppContext } from "../Contexts/AppContext";
import CreateNavbar from "../Components/CreateNavbar";
import { MetadataKeys } from "../Components/AssistantSettings";
import useChatBots, { IBot } from "../Hooks/useChatbots";
import NotFoundPage from "./Notfound";
import TemplateBuilder from "../Components/TemplateBuilder";
import { InputType } from "./ChatbotEditor";
import CreateTemplate from "../Components/CreateTemplate";

interface ITemplateEditor {
    mode: 'new' | 'edit',
    chatbot?: IBot
}

export const typeToInputTypeMap = {
    [InputType.File]: InputType.File,
    [InputType.Web]: InputType.Web,
    [InputType.Video]: InputType.Video,
    [InputType.Template]: InputType.Template,
    [InputType.Default]: InputType.Default
}

export default function TemplateEditor({ mode }: ITemplateEditor) {
    const { session } = useContext(SupabaseContext)
    const { setSources, setVisibility, setDescription, setName, setTemperature, setSystemMessage, setStarterMessage, setSuggestMessages, setIncludeReferences } = useContext(AppContext)
    const storedToken = session?.access_token
    const [inputType] = useState<InputType>(InputType.Template)
    const { botId } = useParams<{ botId?: string }>();
    const { bot, notFound } = useChatBots({ storedToken, botId, 'type': 'templates'})

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

    if(notFound) return <NotFoundPage />

    return <div className="h-full w-full text-black overflow-y-auto">
        <div className="flex flex-col h-full">
            <CreateTemplate inputType={inputType} mode={mode} />
            <div className="w-full sm:max-w-[900px] mx-auto h-full pt-4 p-4 flex flex-col">
                <div className="flex flex-col sm:flex-row mt-2 gap-5">
                    <div className="sm:w-4/5">
                        <TemplateBuilder mode={mode}/>
                    </div>
                </div>
            </div>
            <div className="h-[100px] flex shrink-0"></div>
        </div >
    </div>
}