import { cloneElement, useContext } from "react";
import { AccountContext } from "../Contexts/AuthContext";
import { Icons, plans } from "../constants";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import { useNavigate } from "react-router-dom";

export default function AccountView() {
    const { userGroup } = useContext(AccountContext)
    const { session, handleLogout } = useContext(SupabaseContext)
    const navigate = useNavigate()

    if (session) return <>

        <div className="h-full w-full overflow-y-auto">
            <div className="flex flex-col h-full gap-4">
                    <h1 className="text-lg font-semibold"> Account </h1>
                    <div className="border border-gray-200 rounded-md sm:w-[420px]">
                        <h1 className="px-4 py-2 border-b font-semibold bg-gray-100">Plan</h1>
                        <div className="w-full px-4 flex gap-2 flex-col mt-2 pb-2">
                            <p> You are currently on the <span className="font-semibold capitalize">{plans[userGroup].name}</span> plan.  </p>
                            <p className=" font-semibold">Features</p>
                            <ul>
                                {plans[userGroup].features.map((feature, index) => <li className="flex items-center flex-shrink-0 text-sm gap-2" key={index}>
                                    {cloneElement(Icons.check, { className: 'w-6 h-6 fill-current text-green-500' })}
                                    {feature}
                                </li>)}
                            </ul>
                            {
                                userGroup === 'free' ? <button className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-2" onClick={() => navigate('/pricing')}>Upgrade</button>
                                    :
                                    <>
                                        <p className="font-semibold">Price</p>
                                        <p>{plans[userGroup].price}</p>
                                    </>
                            }
                        </div>
                    </div>
                    <div className="border border-gray-200 rounded-md sm:w-[420px]">
                        <h1 className="px-4 py-2 border-b font-semibold bg-gray-100">Account</h1>
                        <div className="w-full px-4 flex pb-2 border-b py-2">
                            <p>{session.user.email} </p>
                        </div>
                        <div className="w-full px-4 flex flex-col pb-2 py-2">
                            <a href='https://billing.stripe.com/p/login/aEUbKfh0DaUw0aAbII' target='_blank' rel="noreferrer" className='text-blue-500 underline'>
                                Manage billing
                            </a>
                        </div>
                    </div>
                    <div className="border border-gray-200 rounded-md sm:w-[420px]">
                        <button onClick={handleLogout} className="w-full px-4 py-2 border-b font-semibold bg-gray-100">Logout</button>
                    </div>
                </div>
        </div >
    </>
    else return null
}