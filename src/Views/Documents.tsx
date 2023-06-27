import { cloneElement, useContext, useEffect, useState } from "react";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import useChatBots from "../Hooks/useChatbots";
import { since } from "../Utils/Utils";
import { Link } from "react-router-dom";
import { Icons } from "../constants";

export default function Documents() {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { bots, loading } = useChatBots({ storedToken, 'type': 'bots' })
    const [search, setSearch] = useState('')
    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) { setSearch(e.target.value) }
    const filteredBots = bots?.filter(bot => bot.name.toLowerCase().includes(search.toLowerCase()))

    return <>
        <div className="h-full w-full overflow-y-auto overflow-x-clip">
            <div className="flex w-full flex-col gap-4">
                <span className="text-lg font-semibold">Documents</span>
                <div className="flex w-full justify-between gap-2 text-sm">
                    <input type="text" placeholder="Filter by name..." className="border border-gray-300 rounded-md px-4 py-2 flex-1 max-w-sm" onChange={handleSearch} />
                    <Link to={`/create/post?type=pdf`} className="bg-indigo-500 text-white rounded-md px-2 flex items-center" onClick={() => (true)}>
                        {cloneElement(Icons.add, { className: 'w-5 h-5 fill-current' })}
                        Add document
                    </Link>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                        <tr className="text-gray-500 text-xs uppercase">
                            <th className="w-[30px]"></th>
                            <th className="text-left">Name</th>
                            <th className="text-left">Created</th>
                            <th className="text-left"></th>
                        </tr>
                    </thead>
                    {loading || !bots ?
                        <tbody>
                            <tr className=" border-gray-200">
                                <td className="py-2"></td>
                                <td className="py-2"> <span className="animate-pulse">Loading...</span> </td>
                            </tr>
                        </tbody>
                        :
                        <tbody>
                            {filteredBots && filteredBots?.length > 0 ? filteredBots.map((bot, index) => {
                                return <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2"> {cloneElement(Icons.description, { className: 'w-5 h-5 fill-current' })} </td>
                                    <td className=""> <Link to={`/documents/${bot.id}`} className="hover:underline overflow-hidden text-ellipsis"> {bot.name} </Link> </td>
                                    <td className="text-gray-500">
                                        <span>{since(bot.created_at)}</span>
                                    </td>
                                    <td>
                                        <Link to={`/edit/post/${bot.id}`} className="text-gray-500 hover:text-indigo-500">
                                            <span className="text-right">Edit</span>
                                        </Link>
                                    </td>
                                </tr>
                            }
                            ) : <tr className="text-gray-500 text-sm uppercase">
                                <td></td>
                                <td className="text-left py-2">No documents found</td>
                                <td className="text-left"></td>
                            </tr>}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    </>
}