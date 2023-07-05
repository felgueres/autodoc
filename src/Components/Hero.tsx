import { cloneElement, useContext } from "react";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { Link } from "react-router-dom";
import { Icons } from "../constants";

export default function Hero() {
    const { session } = useContext(SupabaseContext)
    if (session) return <></>
    return <>
        <div className="flex items-center justify-center flex-col w-full px-5 py-4 rounded-lg gap-5">
            <div className="h-8" />
            <p className="font-bold text-3xl sm:text-5xl text-center">
                AI-first document automation
            </p>
            <div className="text-lg sm:text-xl text-center">
                Autodoc helps you extract the data from documents that you need to run your business
            </div>
            <div className="mt-2"> 
                <Link to='/login' className="text-xl bg-indigo-500 text-white rounded-full px-8 py-3"> Get started for free </Link> 
            </div>
            <div className="flex items-center gap-2">
                {cloneElement(Icons.check, { className: 'w-5 h-5 fill-current text-green-500' })}
                <span className="text-sm text-gray-500">No credit card required</span>
            </div>
        </div>
    </>
}