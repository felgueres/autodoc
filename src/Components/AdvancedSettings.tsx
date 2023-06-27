import { cloneElement, useContext, useState } from "react"
import { Icons } from "../constants"
import { AppContext } from "../Contexts/AppContext"
import { INITIAL_VALUES } from "../constants"

export default function AdvancedSettings() {
    const [showMoreModel, setShowMoreModel] = useState(false)
    const {temperature, setTemperature, system_message, setSystemMessage} = useContext(AppContext)

    return <>
        <div className="flex flex-col mt-4 p-4 rounded border-b">
            <div onClick={() => setShowMoreModel(!showMoreModel)} className="flex justify-between gap-4 cursor-pointer">
                <span className="font-semibold text-gray-700">Model settings (advanced)</span>
                <span className="material-symbols-rounded  text-2xl">
                    {showMoreModel ? cloneElement(Icons.arrow_up, { className: 'w-6 h-6' }) : cloneElement(Icons.arrow_down, { className: 'w-6 h-6' })}
                </span>
            </div>
            {showMoreModel && <><hr className="my-2" /> </>}
            {
                showMoreModel &&
                <div className="">
                    <div className="mt-6 gap-4 text-sm border-bottom flex">
                        <div className="font-semibold justify-between text-gray-700 flex w-[120px]">
                            Temperature <span>{temperature}</span>
                        </div>
                    </div>
                    <div className="flex flex-col mt-6">
                        <input
                            type="range"
                            min="0.0"
                            max="1"
                            step="0.25"
                            value={temperature}
                            onChange={(event) => setTemperature(parseFloat(event.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm">
                            <span>Precise</span>
                            <span>Creative</span>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="mt-2 text-sm border-bottom flex pb-2 flex-col">
                        <div className="flex justify-between">
                            <div className="font-semibold mb-2 text-zinc-700">Initial System Instruction <a href="https://platform.openai.com/docs/guides/chat/instructing-chat-models" target="_blank" rel="noreferrer" className="text-blue-600">(learn more)</a></div>
                            <span onClick={() => setSystemMessage(INITIAL_VALUES.default_chatbot.system_message)} className="cursor-pointer">
                                reset to default
                            </span>
                        </div>
                        <textarea
                            value={system_message}
                            onChange={(event) => setSystemMessage(event.target.value)}
                            className="w-full h-24 resize-y border rounded p-2 text-sm"
                        />
                    </div>
                </div>
            }
        </div>
    </>
}