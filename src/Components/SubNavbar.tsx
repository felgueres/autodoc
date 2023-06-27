import { NavLink } from "react-router-dom";

export default function SubNav() {
    return <div className="max-w-4xl flex py-12 sm:py-6 mx-auto gap-4">
        <NavLink to='/' className={({ isActive }) => isActive ? "text-xl sm:text-xl font-bold border-b-2 border-black" : "text-xl sm:text-xl "}>
            Create
        </NavLink>
        <NavLink to='/bots' className={(
            { isActive }) => isActive ? "text-xl sm:text-xl font-bold border-b-2 border-black" : "text-xl sm:text-xl "}>
            My Chatbots
        </NavLink>
    </div>
}
