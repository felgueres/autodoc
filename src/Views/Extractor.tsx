import '../input.css';
import { cloneElement, useContext, useEffect, useState } from "react";
import { Icons } from "../constants";
import { AppContext } from "../Contexts/AppContext";
import useChatBots from "../Hooks/useChatbots";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import useExtract, { TFacts } from "../Hooks/useSearch";
import { TField, TTemplate } from "../Contexts/TemplateContext";
import PDFViewer from "../Components/PDFViewer";
import Modal from "../Modals/Modal";

export type TMode = 'embed' | 'app' | 'viewer' | 'demo'

function Processing() {
    return <>
        <div>
            <div className="flex items-center flex-col gap-4 text-sm py-5">
                {cloneElement(Icons.time, { className: 'w-10 h-10' })}
                <h1 className="text-xl font-medium">We're extracting the document</h1>
                <p className="text-gray-500">
                    Depending on the number of fields to extract, this may take 1-2 minutes.
                </p>
            </div>
        </div>
    </>
}

function Fields({ template }: { template: TTemplate | null }) {
    function renderTemplate() {
        if (!template) return <p className="text-sm text-gray-400">No template selected</p>
        // if (loadingFacts) return (<> <Processing /> </>)
        return <>
            <div className="w-full h-full">
                {template.fields.map((f, i) => { return <FactItem field_idx={i} fact={f} /> })}
            </div>
        </>
    }
    return <div className="flex flex-col gap-2 mt-4">
        {renderTemplate()}
    </div>
}

function FactItem({ fact: tFact, field_idx }: { fact: TField, field_idx: number }) {
    const [pageAvailable, setPageAvailable] = useState(false)
    const { setHighlightItem, facts, setFacts } = useContext(AppContext)
    const { loading, setIsSubmit } = useExtract({ field_idx })

    useEffect(() => {
        if (!facts) { return }
        const f = facts[tFact.name]
        if (!f) { return }
        setPageAvailable(f.page_number > 0)
    }, [facts, setFacts])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, fact: TField) => {
        e.preventDefault()
        if (!facts) { return }
        const value = e.target.value
        const pn = facts[fact.name]?.page_number || 0
        const newFacts = { ...facts, [tFact.name]: { value, page_number: pn } }
        setFacts(newFacts)
    }

    const handleShowSource = () => {
        if (!facts) { console.log('no facts'); return }
        const f = facts[tFact.name]
        if (!f || !pageAvailable) { console.log('f', f); console.log('pageAvailable', pageAvailable); return }
        setHighlightItem({ text: f.value, page_number: f.page_number })
    }

    return <>
        <div className={`group grid grid-cols-6 gap-0 text-sm py-2 px-2 hover:bg-gray-50 border-b`}>
            <div className={`group-hover:bg-gray-50 col-span-2 `} >
                <div className="flex items-center gap-2 h-full">
                    <div className="w-[150px]">{tFact.name}</div>
                    <div className={`${pageAvailable ? 'cursor-pointer' : ''}`} onClick={handleShowSource}>
                        {cloneElement(Icons.quick_reference_all, { className: `w-5 h-5 fill-current ${pageAvailable ? 'text-gray-500' : 'text-gray-200'}` })}
                    </div>
                    <div className="cursor-pointer" onClick={() => setIsSubmit(true)}>
                        {cloneElement(loading ? Icons.progress_activity : Icons.refresh, { className: `w-5 h-5 fill-current ${loading ? 'animate-spin' : ''}` })}
                    </div>
                </div>
            </div>
            <div className="group-hover:bg-gray-50 col-span-4">
                <div className='flex items-center'>
                    {facts &&
                        <textarea
                            className="w-full text-sm p-1 border border-gray-200 rounded-sm whitespace-pre-line"
                            placeholder="Enter value"
                            value={facts[tFact.name]?.value}
                            onChange={(e) => handleChange(e, tFact)} />}

                </div>
            </div>
        </div>
    </>
}

export default function Extractor() {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { templates, loading, notFound } = useChatBots({ storedToken, type: 'templates' })
    const { chatbot, template, setTemplate, setMsgs, highlightItem, setHighlightItem, facts, setFacts } = useContext(AppContext)
    const { loading : loadingFacts, setIsSubmit } = useExtract({ field_idx: -1 })

    // function handleReset() {
    //     setFacts(null);
    // }

    function handleExport() {
        if (!facts) { setMsgs([{ type: 'warning', 'message': 'No facts to export', duration: 2000 }]); return null }

        const csv = Object
            .entries(facts)
            .map(([key, val], i) => { return `${key},${val?.value}` })
            .join('\n')

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
        // handleReset()
        setIsSubmit(true)
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
                            {templates?.map((t) => { return <option key={t.template_id} value={t.template_id ?? ''}>{t.name}</option> })}
                        </select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button disabled={!template}
                            id="extractor-form"
                            className={`${!template ? 'opacity-50  cursor-not-allowed' : 'cursor-pointer'} flex justify-center gap-2 items-center bg-indigo-500 text-white px-5 py-1 rounded-md`} onClick={(e) => { e.preventDefault(); handleClick(e) }}>
                            Extract all
                            {loadingFacts ? cloneElement(Icons.progress_activity, { className: 'w-5 h-5 fill-current animate-spin' }) : ''}
                        </button>
                        <ExportCSV />
                    </div>
                </div>
            </div>
            <Fields template={template} />
            <div className='flex h-8 flex-shrink-0' />
        </div>

        <Modal onClose={() => setHighlightItem(null)} open={highlightItem !== null}>
            <div className="">
                <PDFViewer highlightItem={highlightItem} />
            </div>
        </Modal>
    </>
}