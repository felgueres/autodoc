import { cloneElement, useContext } from "react";
import '../input.css';
import { Icons } from "../constants";
import { AppContext } from "../Contexts/AppContext";
import useChatBots from "../Hooks/useChatbots";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import useExtract from "../Hooks/useSearch";

export type TMode = 'embed' | 'app' | 'viewer' | 'demo'

export default function Extractor() {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { templates, loading, notFound } = useChatBots({ storedToken, type: 'templates' })
    const { facts, setFacts, loading: loadingFacts, setIsSubmit } = useExtract()
    const { chatbot, template, setTemplate, msgs, setMsgs } = useContext(AppContext)

    function handleReset() {
        setFacts({ facts: null });
    }

    function handleExport() {
        if (!facts.facts){
            setMsgs([{ type: 'warning', 'message': 'No facts to export', duration: 2000}])
            return
        } 

        const csv = Object.entries(facts.facts).map(([key, val], i) => { return `${key},${val}` }).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', chatbot.name + '_extract.csv'); // TODO: change the name of the file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function ExportCSV() {
        return <button className="flex text-sm items-center gap-1 cursor-pointer hover:underline" onClick={handleExport}>
            {cloneElement(Icons.download, { className: 'w-5 h-5' })}
            Export CSV
        </button>
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        handleReset()
        setIsSubmit(true)
    }

    function Fields() {
        function renderTemplate() {
            if (!template) return <p className="text-sm text-gray-400">No template selected</p>
            return template.fields.map((f, i) => {
                return <div key={i} className="flex items-center w-full gap-2">
                    <span className="text-sm w-[150px]"> {f.name} </span>
                    {
                        facts.facts &&
                        <input className="flex-1 text-sm p-1 border border-gray-200 rounded-sm" placeholder="Enter value" value={facts.facts[f.name] ?? ''} onChange={(e) => {
                            const newFacts = { ...facts.facts }
                            newFacts[f.name] = e.target.value
                            setFacts({ facts: newFacts })
                        }} />
                    }
                    {
                        loadingFacts &&
                        <div className="flex-1 text-sm p-1 rounded-sm">
                            <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    }
                </div>
            })
        }

        // return <div className="flex flex-col gap-2 mt-4">
        //     <h1 className="text-base font-medium">Fields</h1>
        //     {renderTemplate()}
        // </div>

        return <div className="flex flex-col gap-2 mt-4">
            <h1 className="text-base font-medium">Fields</h1>
            {renderTemplate()}
        </div>

    }

    return <>
        <div className="bg-white p-4 rounded-sm">
            <div className="flex flex-col pb-4 border-b">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-base font-medium">Template</h1>
                        <select id="template" className="border border-gray-300 rounded-md px-2 py-1 text-sm mt-1" onChange={(e) => {
                            const templateId = e.target.value
                            const newTemplate = templates?.find((t) => t.template_id === templateId)
                            setTemplate(newTemplate ?? null)
                        }}>
                            <option value="">Select a template</option>
                            {templates?.map((t) => {
                                return <option key={t.template_id} value={t.template_id ?? ''}>{t.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button disabled={!template} id="extractor-form" className={`${!template ? 'opacity-50  cursor-not-allowed' : 'cursor-pointer'} flex justify-center gap-2 items-center bg-indigo-500 text-white px-5 py-1 rounded-md`} onClick={(e) => { e.preventDefault(); handleClick(e) }}> Extract </button>
                        <ExportCSV />
                    </div>
                </div>
            </div>

            <Fields />

            <div className='flex h-8 flex-shrink-0' />
        </div>
    </>
}