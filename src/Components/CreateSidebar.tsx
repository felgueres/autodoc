import { Icons } from "../constants"
import { NavLink } from "react-router-dom"
import Resources from "./Resources"

export const createTypes = [
    { name: 'Documents', icon: Icons.description, id: 'documents' },
    { name: 'Templates', icon: Icons.edit_note, id: 'templates' },
    { name: 'Account', icon: Icons.edit_note, id: 'account' },
]

export default function CreateSidebar() {
    return <div className="flex flex-col gap-2">
        {createTypes.map((type) => {
            return <NavLink key={type.id} to={`/${type.id}`} className={({ isActive }) => ` ${isActive ? 'bg-indigo-500 text-white' : 'text-gray-500'} py-1 rounded-full cursor-pointer text-sm text-center`}>
                {type.name}
            </NavLink>
        })}
        <Resources/>
    </div>
}