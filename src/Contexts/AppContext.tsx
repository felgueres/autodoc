import { createContext, useContext, useEffect, useState } from "react";
import { TToast } from "../Utils/Utils";
import { TUserData } from "../Hooks/useUserData";
import { IBot } from "../Hooks/useChatbots";
import { TRef } from "../Hooks/useInference";
import { INITIAL_VALUES } from "../constants";
import { IMessage } from "../Components/Chat";
import { SupabaseContext } from "./SupabaseContext";
import { TTemplate } from "./TemplateContext";
import { TFacts } from "../Hooks/useSearch";
import { THighlighItem } from "../Components/PDFViewer";

export type AppProps = {
    msgs: Array<TToast>
    setMsgs: (msgs: Array<TToast>) => void
    reset: () => void
    loading: boolean
    userData: TUserData[]
    sources: Array<TUserData>
    setSources: (sources: Array<TUserData>) => void
    newDataHash: string
    setNewDataHash: (newDataHash: string) => void
    chatbot: IBot
    setChatbot: (chatbot: IBot) => void
    isUpload: boolean
    setIsUpload: (isUpload: boolean) => void
    triggerBotsRefresh: boolean
    setTriggerBotsRefresh: (triggerBotsRefresh: boolean) => void
    bots: IBot[]
    setBots: (bots: IBot[]) => void
    mode: string
    refs: Array<TRef>
    starterMessage: IMessage
    setStarterMessage: (starterMessage: IMessage) => void
    suggest_messages: string
    setSuggestMessages: (suggest_messages: string) => void
    include_references: boolean
    setIncludeReferences: (include_references: boolean) => void
    temperature: number
    setTemperature: (temperature: number) => void
    system_message: string
    setSystemMessage: (system_message: string) => void
    modelId: string
    setModelId: (modelId: string) => void
    name: string
    setName: (name: string) => void
    description: string
    setDescription: (description: string) => void
    file : File | null
    setFile: (file: File | null) => void
    visibility: 'public' | 'private' | 'unlisted'
    setVisibility: (visibility: 'public' | 'private' | 'unlisted') => void
    storedToken: string | null
    setStoredToken: (storedToken: string | null) => void
    template: TTemplate | null
    setTemplate: (template: TTemplate | null) => void
    facts: TFacts | null 
    setFacts: (facts: TFacts | null) => void
    highlightItem: THighlighItem | null
    setHighlightItem: (highlightItem: THighlighItem | null) => void
}

export const AppContext = createContext<AppProps>({
        msgs: [] as Array<TToast>,
        setMsgs: () => { },
        reset: () => { },
        loading: false,
        userData: INITIAL_VALUES.userData,
        sources: INITIAL_VALUES.default_chatbot.sources,
        setSources: () => { },
        newDataHash: '',
        setNewDataHash: () => { },
        chatbot: INITIAL_VALUES.default_chatbot,
        setChatbot: () => { },
        isUpload: false,
        setIsUpload: () => { },
        triggerBotsRefresh: false,
        setTriggerBotsRefresh: () => { },
        bots: [] as Array<IBot>,
        setBots: () => { },
        mode: 'app',
        refs: [] as Array<TRef>,
        starterMessage: { id: 1, role: 'assistant', content: '👋 Hi! How can I help you?' },
        setStarterMessage: () => { },
        suggest_messages: '',
        setSuggestMessages: () => { },
        include_references: false,
        setIncludeReferences: () => { },
        temperature: 0.5,
        setTemperature: () => { },
        system_message: '',
        setSystemMessage: () => { },
        modelId: INITIAL_VALUES.default_chatbot.model_id,
        setModelId: () => { },
        name: '',
        setName: () => { },
        description: '',
        setDescription: () => { },
        file: null,
        setFile: () => { },
        visibility: 'public',
        setVisibility: () => { },
        storedToken: null,
        setStoredToken: () => { },
        template: null,
        setTemplate: () => { },
        facts: null,
        setFacts: () => { },
        highlightItem: null,
        setHighlightItem: () => { },
    })


type AppContextProviderProps = {
    children: React.ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const { session } = useContext(SupabaseContext)
    const [msgs, setMsgs] = useState<Array<TToast>>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [userData, setUserData] = useState<TUserData[]>(INITIAL_VALUES.userData)
    const [sources, setSources] = useState<Array<TUserData>>(INITIAL_VALUES.default_chatbot.sources)
    const [newDataHash, setNewDataHash] = useState<string>('')
    const [isUpload, setIsUpload] = useState<boolean>(false)
    const [triggerBotsRefresh, setTriggerBotsRefresh] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    // Chatbot related
    const [chatbot, setChatbot] = useState<IBot>(INITIAL_VALUES.default_chatbot)
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [starterMessage, setStarterMessage] = useState<IMessage>({ id: 1, role: 'assistant', content: '👋 Hi! How can I help you?' })
    const [suggest_messages, setSuggestMessages] = useState<string>('')
    const [include_references, setIncludeReferences] = useState(false)
    const [temperature, setTemperature] = useState(INITIAL_VALUES.default_chatbot.temperature)
    const [system_message, setSystemMessage] = useState(INITIAL_VALUES.default_chatbot.system_message)
    const [modelId, setModelId] = useState(INITIAL_VALUES.default_chatbot.model_id)
    const [visibility, setVisibility] = useState<'private'|'public'|'unlisted'>('public') 
    const [storedToken, setStoredToken] = useState<string|null>(null)
    const [template, setTemplate] = useState<TTemplate|null>(null)
    const [facts, setFacts] = useState<TFacts | null>(null);
    const [highlightItem, setHighlightItem] = useState<THighlighItem | null>(null)
    // Other
    const [bots, setBots] = useState<Array<IBot>>([])
    const [mode, setMode] = useState<string>('app')
    const [refs, setRefs] = useState<Array<TRef>>([])

    const reset = () => {
        setMsgs([])
        setLoading(false)
        setUserData(INITIAL_VALUES.userData)
        setSources(INITIAL_VALUES.default_chatbot.sources)
        setNewDataHash('')
        setChatbot(INITIAL_VALUES.default_chatbot)
        setIsUpload(false)
        setTriggerBotsRefresh(false)
        setBots([])
        setMode('app')
        setRefs([])
        setStarterMessage({ id: 1, role: 'assistant', content: '👋 Hi! How can I help you?' })
        setSuggestMessages('')
        setIncludeReferences(false)
        setTemperature(INITIAL_VALUES.default_chatbot.temperature)
        setSystemMessage(INITIAL_VALUES.default_chatbot.system_message)
        setModelId(INITIAL_VALUES.default_chatbot.model_id)
        setName('')
        setDescription('')
        setFile(null)
        setVisibility('private')
        setStoredToken(null)
        setTemplate(null)
        setFacts(null);
        setHighlightItem(null)
    }


    useEffect(() => {
        if (session) {
            setStoredToken(session.access_token)
        }
    }, [session])

    const AppContextValue = {
        msgs,
        setMsgs,
        reset,
        loading,
        userData,
        sources,
        setSources,
        newDataHash,
        setNewDataHash,
        chatbot,
        setChatbot,
        isUpload,
        setIsUpload,
        triggerBotsRefresh,
        setTriggerBotsRefresh,
        bots,
        setBots,
        mode,
        refs,
        setRefs,
        starterMessage,
        setStarterMessage,
        suggest_messages,
        setSuggestMessages,
        include_references,
        setIncludeReferences,
        temperature,
        setTemperature,
        system_message,
        setSystemMessage,
        modelId,
        setModelId,
        name,
        setName,
        description,
        setDescription,
        file,
        setFile,
        visibility,
        setVisibility,
        storedToken,
        setStoredToken,
        template,
        setTemplate,
        facts,
        setFacts,
        highlightItem,
        setHighlightItem,
    }

    return (
        <AppContext.Provider value={AppContextValue}> 
            {children}
        </AppContext.Provider>
    );
};