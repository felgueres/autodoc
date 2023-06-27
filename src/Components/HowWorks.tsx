import { cloneElement, useContext, useState } from "react";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { Icons } from "../constants";

export const stepsMap: { [key: string]: { description: string, title: string, image: string, step: number } } = {
    'inputSource': { description: 'Upload your documents.', title: 'Upload data', image: '/assets/step1.png', step: 1 },
    'inputSelection': { description: 'Specify the fields you want to extract data for.', title: 'Fill in template', image: '/assets/step2.png', step: 2 },
    'compute': { description: 'Our AI models will process your content and extract the fields from your template.', title: 'AI-assisted extraction', image: '/assets/step2.png', step: 3 },
    'output': { description: 'Edit and finalize the record.', title: 'Finalize the record', image: '/assets/step2.png', step: 4 },
}

export default function HowItWorks() {
    const { session } = useContext(SupabaseContext)
    const [step, setStep] = useState(1)

    if (session) return <></>

    return <>
        <div className="w-full py-4 rounded-lg mt-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-left">How it works</h1>
            <div className="grid sm:grid-cols-2 gap-5 mt-4">
                <div>
                    {
                        Object.keys(stepsMap).map((key) => {
                            return <div key={key} className="flex flex-col gap-2 mt-4 cursor-pointer" onClick={() => setStep(stepsMap[key].step)}>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xl font-medium">{stepsMap[key].step}. {stepsMap[key].title}</span>
                                    {step === stepsMap[key].step ? cloneElement(Icons.arrow_down, { className: 'w-5 h-5' }) : cloneElement(Icons.navigate_next, { className: 'w-5 h-5 text-gray-300' })}
                                </div>
                                {step === stepsMap[key].step && <span className="text-gray-500">{stepsMap[key].description}</span>}
                            </div>
                        })
                    }
                </div>
                <div className="h-[400px] overflow-clip">
                    {
                        Object.keys(stepsMap).map((key) => {
                            return <div key={key} className={`flex items-center gap-2 mt-4 rounded-lg overflow-clip ${step === stepsMap[key].step ? 'flex' : 'hidden'}`}>
                                <img src={stepsMap[key].image} alt={key} className="w-full" />
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </>
}