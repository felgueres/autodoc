import { useContext } from "react"
import { SupabaseContext } from "../Contexts/SupabaseContext"
import { Link } from "react-router-dom"

export default function NewUserInfo() {
    const {session} = useContext(SupabaseContext)
    if (session) return <></>
    return <>
        <div className="flex flex-col gap-2 w-[175px]">
            <div className="flex flex-col gap-2">
                <p className="text-base font-semibold"> New to Upstream?</p>
                <Link to='/login' className="text-sm text-gray-500"> Sign up to publish interactive content</Link>
                <span className="text-xs">
                    By signing in, you agree to our
                    <a target="_blank" className="text-indigo-500" href="https://docs.google.com/document/d/14jTkiTqmfEd2t74HSSsSw3GVnNVTik1QHPl1PZ2d_fo/edit?usp=sharing"> Privacy</a>
                    <span> and </span>
                    <a target="_blank" className="text-indigo-500" href="https://docs.google.com/document/d/14jTkiTqmfEd2t74HSSsSw3GVnNVTik1QHPl1PZ2d_fo/edit?usp=sharing"> Terms </a>
                </span>
            </div>
        </div>
    </>
}
