import { Link } from "react-router-dom"
import { Icons } from "../constants"
import { cloneElement } from "react"
import { NavLink } from "react-router-dom"

const createTypes = [
    { name: 'PDFs', icon: Icons.description, type: 'pdf'},
    { name: 'Templates', icon: Icons.edit_note, type: 'template' },
]

export default function CreateSidebar() {
    return <div className="flex flex-col gap-2">
        {createTypes.map((type) => {
            return <>
                <NavLink to={`/create/post?type=${type.type}`} className="pl-5 py-2 bg-indigo-500 text-white rounded-md flex items-center gap-2 w-[175px] hover:bg-indigo-600">
                    {cloneElement(type.icon, { className: 'w-5 h-5 fill-current' })}
                    {type.name}
                </NavLink>
            </>
        })}
    </div>
}