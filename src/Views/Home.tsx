import { useContext, useEffect } from "react"
import { AppContext } from "../Contexts/AppContext";
import CreateSidebar from "../Components/CreateSidebar";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import Landing from "./Landing";
import { useNavigate } from "react-router-dom";
import { TemplateContext } from "../Contexts/TemplateContext";
import Documents from "./Documents";
import Templates from "./Templates";
import AccountView from "./AccountView";

export default function Home({ view }: { view: string }) {
    const { session } = useContext(SupabaseContext)
    const { reset } = useContext(AppContext)
    const { reset: resetTemplate } = useContext(TemplateContext)
    const navigate = useNavigate()

    useEffect(() => { reset(); resetTemplate() }, [])

    const renderInput = () => {
        switch (view) {
            case 'documents':
                return <Documents/>
            case 'templates':
                return <Templates/>
            case 'account':
                return <AccountView/>
            default:
                return null
        }
    }

    if (!session) return <Landing />

    return <div className="h-full w-full text-black overflow-y-auto">
        <div className="px-4 flex flex-col h-full">
            <div className="border-gray-200">
                <div className="w-[56rem] mx-auto flex flex-row gap-10 py-5">
                    <div className="flex flex-col gap-5 w-[100px]">
                        <span onClick={() => navigate('/')} className="font-semibold text-center text-xl tracking-tight cursor-pointer">Autodoc</span>
                        <CreateSidebar />
                    </div>
                    <div className="flex flex-1 flex-col gap-5">
                        {renderInput()}
                    </div>
                </div>
            </div>
        </div>
    </div>
}