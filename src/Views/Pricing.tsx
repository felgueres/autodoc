import { cloneElement } from "react";
import Navbar from "../Components/Navbar";
import { Icons, plans } from "../constants";

export interface ILogin {
    tokenInput: string;
    setTokenInput: (token: string) => void;
    tokenSubmitted: boolean;
    setTokenSubmitted: (tokenSubmitted: boolean) => void;
    loggedIn: boolean;
    authing: boolean;
}

export default function Pricing() {
    return <div className="h-full w-full overflow-auto overflow-y-auto">
        <div className="mx-auto flex flex-col justify-center px-4">
            <Navbar />
            <div className="flex flex-col justify-center sm:mt-4">
                <h1 className="flex justify-center">
                    <span className="text-4xl sm:text-4xl font-semibold text-zinc-700">Pricing plans</span>
                </h1>
                <h2 className="flex justify-center mt-2">
                    Transform documents into decision-ready data
                </h2>
            </div>
            <div className="w-full sm:max-w-3xl p-2 sm:p-8 mt-2 mx-auto">
                <div className='grid grid-cols-1 gap-4 text-zinc-00 sm:grid-cols-2 sm:gap-4 mx-auto text-zinc-700'>
                    {
                        Object.entries(plans).map(([k, plan], i) => <div key={i} className='flex flex-col border border-indigo-500 sm:p-8 p-4 rounded-md'>
                            <h2 className='mt-2 text-xl font-semibold'>{plan.name}<span className='text-zinc-500'>&nbsp;{plan.price}</span> </h2>
                            <p className='text-sm mt-2'>{plan.desc}</p>
                            <p className="text-sm mt-2">This includes:</p>
                            <ul className='mt-1'>
                                {
                                    plan.features.map((item, i) => <li key={i} className='flex mt-2 items-center gap-2 text-sm'>
                                        {cloneElement(Icons.check, { className: 'w-6 h-6 fill-current text-green-500' })}
                                        {item}
                                    </li>)
                                }
                            </ul>
                            {plan.button && 
                                <button onClick={plan.func} className='mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded'>
                                    Contact sales
                                </button>}
                        </div>)
                    }
                </div>
            </div>
        </div>
    </div>
}
