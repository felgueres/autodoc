import { cloneElement, useContext, useEffect } from "react"
import Navbar from "../Components/Navbar"
import Hero from "../Components/Hero"
import UIHero from "../Components/UIHero"
import HowItWorks from "../Components/HowWorks"
import HowItHelps from "../Components/HowItHelps"
import Footer from "../Components/Footer"
import ProductHunt from "../Components/ProductHunt"
import { Link, useNavigate } from "react-router-dom"
import { Icons } from "../constants"
import { SupabaseContext } from "../Contexts/SupabaseContext"

const GetStarted = () => <div className="flex flex-col items-center gap-2 my-8 ">
    <Link to='/login' className="w-full sm:w-1/2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg mt-8 flex items-center justify-center">
        Get started now
        {cloneElement(Icons.arrow_right, { className: 'w-5 h-5 ml-2 fill-current' })}
    </Link>
</div>

export default function Landing() {
    const { session } = useContext(SupabaseContext)
    const navigate = useNavigate()

    useEffect( () => { if (session) navigate('/documents') }, [session])

    return <div className="h-full w-full text-black overflow-y-auto">
        <div className="flex flex-col h-full">
            <Navbar />
            <div className=" bg-gradient-to-t from-purple-50 to-white border-gray-200 from-50%">
                <div className="w-full sm:w-[56rem] mx-auto gap-y-5 sm:mt-4 mb-10">
                    <Hero />
                </div>
                <div className="w-full sm:max-w-[56rem] mx-auto sm:my-10 px-5">
                    <UIHero />
                </div>
            </div>
            <div className="bg-gradient-to-b from-purple-50 to-white border-t border-gray-200 px-5">
                <div className="w-full sm:w-[56rem] mx-auto mt-12">
                    <HowItHelps />
                </div>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 py-10 px-5">
                <div className="relative w-full sm:w-[56rem] mx-auto mt-12">
                    <HowItWorks />
                    <GetStarted />
                </div>
            </div>
            <div className="">
                <Footer />
            </div>
            <div className="h-12 flex-shrink-0"></div>
            <ProductHunt />
        </div>
    </div >
}