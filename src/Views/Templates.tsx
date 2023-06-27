import { cloneElement, useContext, useEffect, useState } from "react";
import { SupabaseContext } from "../Contexts/SupabaseContext";
import useChatBots from "../Hooks/useChatbots";
import { since } from "../Utils/Utils";
import { Link } from "react-router-dom";
import { Icons } from "../constants";

export default function Templates() {
    const { session } = useContext(SupabaseContext)
    const storedToken = session?.access_token
    const { templates, loading, notFound } = useChatBots({ storedToken, type: 'templates' })
    const [search, setSearch] = useState('')
    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) { setSearch(e.target.value) }
    const filteredT = templates?.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

    return <>
        <div className="h-full w-full overflow-y-auto overflow-x-clip">
            <div className="flex w-full flex-col gap-4">
                <span className="text-lg font-semibold">Templates</span>
                <div className="flex w-full justify-between gap-2 text-sm">
                    <input type="text" placeholder="Filter by name..." className="border border-gray-300 rounded-md px-4 py-2 flex-1 max-w-sm" onChange={handleSearch} />
                    <Link to={`/create/template?type=template`} className="bg-indigo-500 text-white rounded-md px-2 flex items-center" onClick={() => (true)}>
                        {cloneElement(Icons.add, { className: 'w-5 h-5 fill-current' })}
                        Add template
                    </Link>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                        <tr className="text-gray-500 text-xs uppercase">
                            <th className="w-[30px]"></th>
                            <th className="text-left">Name</th>
                            <th className="text-left">Created</th>
                        </tr>
                    </thead>

                    {loading || !templates ?
                        <tbody>
                            <tr className=" border-gray-200">
                                <td className="py-2"></td>
                                <td className="py-2"> <span className="animate-pulse">Loading...</span> </td>
                            </tr>
                        </tbody>
                        :
                        <tbody>
                            {templates && filteredT && filteredT.length > 0 ? filteredT.map((t, index) => {
                                return <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2"> {cloneElement(Icons.summarize, { className: 'w-5 h-5 fill-current' })} </td>
                                    <td className=""> <Link to={`/edit/template/${t.template_id}`} className="hover:underline overflow-hidden text-ellipsis"> {t.name} </Link> </td>
                                    <td className="text-gray-500">
                                        <span>{t?.created_at ? since(t.created_at) : null}</span>
                                    </td>
                                </tr>
                            }
                            )
                                :
                                <tr className="text-gray-500 text-sm uppercase">
                                    <td className=""></td>
                                    <td className="text-left py-2">No templates found</td>
                                    <td className="text-left"></td>
                                </tr>
                            }
                        </tbody>
                    }
                </table>
            </div>
        </div>
    </>
}