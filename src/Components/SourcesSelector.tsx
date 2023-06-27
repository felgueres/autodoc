import {truncate } from '../Utils/Utils';
import { cloneElement} from 'react';
import { Icons} from '../constants';
import { TUserData } from '../Hooks/useUserData';

type MultiSelectProps = {
    items: TUserData[];
    sources: TUserData[];
    setSources: (sources: TUserData[]) => void;
}

export function MultiSelect({ items,sources, setSources} : MultiSelectProps) {
    const toggleItem = (item: TUserData) => {
        if (sources.map((source) => source.source_id).includes(item.source_id)) {
            setSources(sources.filter((source) => source.source_id !== item.source_id))
        } else {
            setSources([...sources, item])
        }
    }

    if (items.length === 0) return (
        <>
            <div className="flex items-center justify-center bg-indigo-500 text-white rounded-sm mt-2">
             {cloneElement(Icons.post_add, { className: 'w-6 h-6 fill-current' })}
                <p className="text-sm p-4"> Import content to get started.  </p>
            </div>
        </>
    )

    return (
        <div className="flex flex-1 flex-col gap-2 text-sm mt-2 whitespace-nowrap  overflow-hidden overflow-y-auto">
            {items.filter((item) => item.status === 'success').map((item) => (
               <label key={item.source_id} className="flex gap-2 items-center pb-2 border-b cursor-pointer">
                    <div className="flex-1 whitespace-nowrap">{item.name ? truncate(item.name, 40) : ''} </div>
                    {item.created_at && <span className="text-gray-400">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>}
                    <input
                        type="checkbox"
                        onChange={() => toggleItem(item)}
                        checked={sources.map((source) => source.source_id).includes(item.source_id)}
                    />
                </label>
            ))}
        </div>
    )
}