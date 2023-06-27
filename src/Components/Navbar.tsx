import { cloneElement, useContext } from "react";
import { useNavigate } from "react-router-dom"
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { Icons } from "../constants";
import { Link } from "react-router-dom";

export default function Navbar() {
    const { session } = useContext(SupabaseContext)
    const email = session?.user?.email
    const navigate = useNavigate()
    const firstLetter = email?.charAt(0).toUpperCase()
    return <div className="bg-white border-b py-1 px-5">
        <nav className="w-full  sm:max-w-[56rem] flex items-center justify-between py-1 bg-white mx-auto">
            <div className="flex items-center gap-2">
                <span onClick={() => navigate('/')} className="font-semibold text-xl tracking-tight cursor-pointer">Autodocs</span>
            </div>
            <div className="mt-1 flex items-center">
                {session ? <></> : <>
                    <Link to="/pricing" className="ml-4 text-sm text-gray-500 hover:text-gray-700">Pricing</Link>
                </>}
                {session ? null :
                    <button className="flex items-center py-1 px-4 rounded text-sm gap-1" onClick={() => navigate('/login')}>
                        Sign in
                        {cloneElement(Icons.arrow_right, { className: 'w-4 h-4' })}
                    </button>
                }
            </div>
        </nav>
    </div>
}
