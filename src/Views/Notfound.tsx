import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

export default function NotFoundPage() {
    return <div className="h-full w-full text-black overflow-y-auto">
        <div className="px-4 flex flex-col h-full">
            <Navbar />
            <div className=" bg-gradient-to-t from-purple-50 to-white border-gray-200 from-50%">
                <div className="w-full sm:w-[56rem] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-y-5 sm:mt-4 mb-10">
                    <div className="col-span-2">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-semibold">Page not found</h1>
                            <span className="text-gray-500">The page you are looking for does not exist.</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <div className="h-12 flex-shrink-0"></div>
        </div>
    </div >
}