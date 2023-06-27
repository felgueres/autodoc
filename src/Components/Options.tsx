import { IBot } from "../Hooks/useChatbots";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../Modals/Modal";
import { MultiSelect } from "./SourcesSelector";
import DataModal from "../Modals/DataModal";
import { truncate } from "../Utils/Utils";
import { AppContext } from "../Contexts/AppContext";

// Helpers 
export function isEmpty(obj = {}) {
    return Object.keys(obj).length === 0;
}

interface IChatbotOptionsProps {
    chatbot: IBot;
    setChatbot: (chatbot: IBot) => void;
}

export function ChatbotOptions({ setChatbot, chatbot }: IChatbotOptionsProps) {
    const { userData, sources, setSources, setNewDataHash, bots } = useContext(AppContext)
    const [searchParams] = useSearchParams()
    const [openDataSettings, setOpenDataSettings] = useState(false)
    const [openNewSource, setOpenNewSource] = useState(false)
    const [isUpload, setIsUpload] = useState(false)

    // Set chatbot from URL
    useEffect(() => {
        if (searchParams.get('chatbotId')) {
            const chatbotId = searchParams.get('chatbotId')
            const chatbotFromURL = bots.find(bot => bot.id === chatbotId)
            if (chatbotFromURL) {
                setChatbot(chatbotFromURL)
            }
        }
    }, [searchParams, bots])

    useEffect(() => {
        if (chatbot.id) {
            setSources(chatbot.sources)
        }
    }, [chatbot])

    function handleDataModalClose() {
        setOpenNewSource(false)
        setIsUpload(false)
    }

    function handleApplyModelSettings() {
        setChatbot({ ...chatbot, sources: sources })
        setOpenDataSettings(false)
    }

    function handleCancel() {
        setSources(chatbot.sources)
        setOpenDataSettings(false)
    }

    function ModalDataSettings() {
        return <>
            <div className='relative pb-2 border-b flex flex-col max-h-screen max-w-3xl w-screen p-4'>
                <div className='pb-2 border-b flex justify-between'>
                    <div> <h3 className="text-lg font-bold text-zinc-700"> Select data source</h3> </div>
                    <button className='self-start py-0 px-1 rounded hover:bg-zinc-200 text-sm whitespace-nowrap cursor-pointer transition duration-300' onClick={() => setOpenDataSettings(false)}>
                        <span className="material-symbols-rounded text-lg">close</span>
                    </button>
                </div>
                <div className='flex flex-col p-1 gap-1 overflow-y-auto'>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-zinc-500 font-semibold">Your sources</span>
                        <button className="text-indigo-700 rounded hover:opacity-90 text-sm whitespace-nowrap cursor-pointer" onClick={() => setOpenNewSource(true)}>
                            Import new
                        </button>
                    </div>
                    <MultiSelect items={userData} sources={sources} setSources={setSources} />
                    <div className="flex h-10 flex-shrink-0"></div>
                </div>
                <div className="absolute bottom-0 gap-2 py-6 w-full border-t bg-white">
                    <button onClick={handleApplyModelSettings} className="bg-indigo-700 text-white py-2 px-4 rounded hover:opacity-90 text-sm whitespace-nowrap cursor-pointer">
                        Use sources
                    </button>
                    <button onClick={handleCancel} className="py-2 px-4 rounded hover:opacity-90 text-sm whitespace-nowrap cursor-pointer">
                        Cancel
                    </button>
                </div>
            </div>
        </>
    }

    return (<>
        <div className="my-6">
            <div className="flex flex-row justify-center px-1">
                <button className="flex items-center justify-between text-sm border-indigo-500 border rounded px-4 py-2 sm:min-w-[420px]" onClick={() => setOpenDataSettings(true)}>
                    {isEmpty(chatbot.sources) ? 'Select data source' : truncate(`(${chatbot.sources.length}) ` + chatbot.sources.map(source => userData.find(data => data.source_id === source.source_id)?.name).join(', '), 50)}
                    <div className="material-symbols-rounded text-xl">expand_more</div>
                </button>
            </div>
        </div>

        <Modal open={openDataSettings} onClose={() => setOpenDataSettings(false)}>
            <ModalDataSettings />
        </Modal>

        <Modal open={openNewSource} onClose={() => setOpenNewSource(false)} >
            {/* <DataModal setNewDataHash={setNewDataHash} storedToken={storedToken} isUpload={isUpload} setIsUpload={setIsUpload} handleModalClose={handleDataModalClose} /> */}
        </Modal>
    </>
    )
}
