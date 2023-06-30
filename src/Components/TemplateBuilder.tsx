import { cloneElement, useContext, useEffect, useState } from "react"
import { HOST, Icons } from "../constants"
import { TField, TemplateContext, ExtractTypes } from "../Contexts/TemplateContext"
import { useNavigate, useParams } from "react-router-dom";
import useChatBots from "../Hooks/useChatbots";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import NotFoundPage from "../Views/Notfound";

interface TooltipProps {
    children: React.ReactNode;
    text: string;
}

export const Tooltip = ({ children, text }: TooltipProps) => {
    const [show, setShow] = useState<boolean>(false)
    const handleMouseEnter = () => setShow(true)
    const handleMouseLeave = () => setShow(false)
    return (
        <div className="relative inline-block">
            <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="text-gray-600 cursor-pointer">{children}</span>
            {show &&
                <div className="absolute z-10 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg left-full top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                    {text}
                </div>
            }
        </div>
    );
};

export default function TemplateBuilder({ mode }: { mode: 'new' | 'edit' }) {
    const {session} = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { template, setTemplate, name, setName, fields, setFields } = useContext(TemplateContext) // global
    const { templateId: botId } = useParams<{ templateId?: string }>();
    const { template:t, notFound } = useChatBots({ storedToken, botId , 'type': 'templates'}) // local
    const navigate = useNavigate()

    useEffect(() => {
        if (mode === 'new') {
            setTemplate({
                template_id: null,
                name: name,
                description: '', // TODO: implement description 
                created_at: null,
                fields: fields
            })
        }
    }, [name, fields])

    useEffect(() => {
        if (mode === 'edit' && botId) {
            if (t) {
                setTemplate(t)
                setName(t.name)
                setFields(t.fields)
            }
        }
    }, [botId, mode, template, t])

    function handleAddField() { setFields([...fields, { name: '', type: 'text', description: '' }]) }

    if (notFound) { navigate('/404') }

    return <>
        <div className="flex flex-col gap-3 text-sm">
            <h1 className="text-base font-semibold">Template information</h1>

            <div className="flex items-center">
                <span className="text-sm font-medium w-[70px]">
                    Name
                </span>
                <input placeholder="Enter name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="py-1 px-2 border rounded-sm text-sm" />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center">
                    <span className="text-sm font-medium w-[70px]">Fields
                        <Tooltip text="Fields are the items you want to extract from a data source.">
                            {cloneElement(Icons.help, { className: 'w-4 h-4 fill-current ml-1' })}
                        </Tooltip>
                    </span>
                    <button onClick={handleAddField} className="px-2 py-1 border rounded-md flex items-center gap-1 bg-indigo-500 text-white text-sm">
                        {cloneElement(Icons.add, { className: 'px-0 w-4 h-4 fill-current' })}
                        Add field
                    </button>
                </div>
                <table className="border-collapse text-sm mt-5">
                    <thead className="uppercase">
                        <tr className="border-b-2">
                            <th className="text-left px-1 py-1 font-normal text-xs">Name</th>
                            <th className="text-center px-1 font-normal text-xs">Description</th>
                            <th className="text-center px-1 font-normal text-xs">Type</th>
                            <th className="text-center px-1 font-normal text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            fields.map((field, index) => {
                                return <tr key={index} className="border">
                                    <td className="border">
                                        <input type="text" placeholder="Enter name" value={field.name} onChange={(e) => {
                                            const newFields = [...fields]
                                            newFields[index].name = e.target.value
                                            setFields(newFields)
                                        }} className="py-1 px-2 w-full" />
                                    </td>
                                    <td className="border">
                                        <input type="text" placeholder="Enter example" value={field.description} onChange={(e) => {
                                            const newFields = [...fields]
                                            newFields[index].description= e.target.value
                                            setFields(newFields)
                                        }} className="py-1 px-2 w-full" />
                                    </td>
                                    <td className="border">
                                        <select value={field.type} onChange={(e) => {
                                            const newFields = [...fields]
                                            newFields[index].type = e.target.value as ExtractTypes
                                            setFields(newFields)
                                        }} className="py-1 px-2 w-full">
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                        </select>
                                    </td>
                                    <td className="flex justify-center items-center py-1">
                                        <button onClick={() => {
                                            const newFields = [...fields]
                                            newFields.splice(index, 1)
                                            setFields(newFields)
                                        }
                                        } className="px-1 py-1 hover:bg-red-500 hover:text-white rounded-sm">
                                            {cloneElement(Icons.delete, { className: 'w-4 h-4 fill-current' })}
                                        </button>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </>
}