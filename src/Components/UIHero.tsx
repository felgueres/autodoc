import { useContext } from "react";
import { SupabaseContext } from "../Contexts/SupabaseContext";

export default function UIHero() {
    const { session } = useContext(SupabaseContext)
    if (session) return <></>
    return <>
        <div className="w-full b-gray-900 rounded-sm border border-gray-200">
            <video className="w-full rounded-sm border-2 border-gray-700" muted playsInline controls>
                <source src="/assets/demo.mp4" type="video/mp4" />
            </video>
        </div>
    </>
}