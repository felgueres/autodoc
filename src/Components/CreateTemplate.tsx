import { cloneElement, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { HOST, Icons } from "../constants";
import { AppContext } from "../Contexts/AppContext";

import { InputType } from "../Views/ChatbotEditor";
import { typeToInputTypeMap } from "../Views/ChatbotEditor";
import { TemplateContext } from "../Contexts/TemplateContext";

interface ICreateNavbar {
    inputType: InputType
    mode: 'new' | 'edit'
}

export default function CreateTemplate({ inputType, mode }: ICreateNavbar) {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { setMsgs, msgs } = useContext(AppContext)
    const { template, reset, name, fields } = useContext(TemplateContext)
    const navigate = useNavigate()
    const { templateId } = useParams()

    useEffect(() => { if (mode === 'edit' && !templateId) { navigate('/') } }, [templateId, mode, navigate])

    function isFilled() { return fields.every((field) => field.name && field.description) }

    const handleCreate = async () => {
        if (!isFilled() || !template) return alert('Please fill in all fields')
        if (fields.length === 0) return alert('Please add at least one field')
        const NEW_TEMPLATE_ENDPOINT = `${HOST}/v1/template/new`

        await fetch(NEW_TEMPLATE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                name: template.name,
                description: template.description,
                fields: template.fields
            })
        }).then((res) => {
            if (res.ok) {
                navigate('/templates', { replace: true , state: { templateCreate: true }})
            } else {
                setMsgs([...msgs, {"duration":2000, "message":'Template was not created. Please try again.',  type: 'error'}])
            }
        })
    }

    const handleUpdate = async () => {
        if (!isFilled() || !template) return alert('Please fill in all fields')
        if (fields.length === 0) return alert('Please add at least one field')
        const UPDATE_TEMPLATE_ENDPOINT = `${HOST}/v1/templates/${templateId}`
        await fetch(UPDATE_TEMPLATE_ENDPOINT, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                name: name,
                description: template.description,
                fields: fields 
            })
        }).then((res) => {
            if (res.ok) {
                navigate('/templates', { replace: true , state: { templateCreate: true }})
            } else {
                setMsgs([...msgs, {"duration":2000, "message":'Template was not created. Please try again.',  type: 'error'}])
            }
        })
    }

    const handleDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete template?')
        if (!confirm) return
        const DELETE_T_ENDPOINT = `${HOST}/v1/templates/${templateId}`
        await fetch(DELETE_T_ENDPOINT, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        }).then((res) => {
            if (res.ok) {
                setMsgs([...msgs, { type: 'success', message: 'Assistant deleted successfully.', duration: 2000 }])
                navigate(`/templates`, { replace: true })
            }
            else {
                setMsgs([...msgs, { type: 'error', message: 'Something went wrong. Please try again.', duration: 2000 }])
            }
        })
    }

    const handleCancel = () => {
        reset()
        navigate('/')
    }

    return <div className="bg-white border-b px-4 py-3">
        <nav className="flex items-center justify-between bg-white mx-auto">
            <div className="flex cursor-pointer justify-center items-center gap-2 rounded-full w-10 h-10 border border-gray-300 bg-gray-50" onClick={handleCancel}>
                {cloneElement(Icons.arrow_back, { className: 'w-5 h-5' })}
            </div>
            <div className="sm:flex items-center justify-center hidden flex-1">
                <h1 className="text-2xl font-bold">
                    {mode === 'new' ? `Create ${typeToInputTypeMap[inputType]} ` : 'Edit'}
                </h1>
            </div>
            <div className="flex items-center w-auto gap-3">
                {mode === 'edit' && <button onClick={handleDelete} className="px-5 py-2 rounded-md flex items-center gap-2 hover:bg-red-500 hover:text-white">
                    <span>Delete</span>
                </button>}
                <button disabled={!template?.fields.length}
                    onClick={mode === 'new' ? handleCreate : handleUpdate} className={`px-5 py-2 bg-indigo-500 text-white rounded-md flex items-center gap-2 hover:bg-indigo-600 ${!template?.fields.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {mode === 'new' ? `Create` : 'Update'}
                </button>
            </div>
        </nav>
    </div>
}
