import { cloneElement, useContext } from "react";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { Icons } from "../constants";

export const valueMap: { [key: string]: { description: string, title: string } } = {
    'instantQuestions': { description: 'Cut down document processing time from hours to seconds', title: 'Make your business move faster'},
    'fast': { description: 'Decrease human errors with our data validation tools', title: 'Get data you can trust'},
    'ai': { description: 'Use plain english to describe what you need to extract from a document', title: 'Build using powerful AI'},
}

export default function HowItHelps() {
    const { session } = useContext(SupabaseContext)

    if (session) return <></>

    return <>
        <div className="flex flex-col items-center py-4 rounded-lg my-8">
            <h1 className="text-3xl  sm:text-4xl font-semibold text-left">How Autodocs can help you</h1>
            <div className="flex flex-col gap-5 mt-10">
                {
                    Object.keys(valueMap).map((key) => {
                        
                        switch (key) {
                            case 'instantQuestions':
                                var icon = Icons.bolt; break;
                            case 'fast':
                                var icon = Icons.time; break;
                            case 'ai':
                                var icon = Icons.fast_forward; break;
                            default:
                                var icon = Icons.help
                        }

                        return <div key={key} className="flex gap-5 mt-4 items-start"> 
                            <div className="flex flex-shrink-0 items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-lg text-white">
                                {cloneElement(icon, { className: 'w-8 h-8 fill-current' })}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xl font-medium">{valueMap[key].title}</span>
                                <span className="text-gray-500">{valueMap[key].description}</span>
                            </div>
                        </div>
                    })
                }  
            </div>
        </div>
    </>
}