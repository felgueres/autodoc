import { useContext } from "react";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { Link } from "react-router-dom";

export default function Hero() {
    const { session } = useContext(SupabaseContext)
    if (session) return <></>
    return <>
        <div className="w-full px-5 py-4 rounded-lg">
            <div className="h-8"></div>
            <p className="font-bold text-3xl sm:text-4xl">
                Document automation with AI
            </p>
            <br />
            <p className="text-lg sm:text-xl"> 
                Transform any document or form into decision-ready data. 
            </p>
            <br />
            <br />
            <div className="flex gap-2">
                <Link to='/login' className="bg-indigo-500 text-white rounded-md px-4 py-2"> Get started </Link>
            </div>
        </div>
    </>
}