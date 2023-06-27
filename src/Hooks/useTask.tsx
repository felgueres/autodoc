import { useState, useEffect } from 'react'
import { HOST } from '../constants';
import { IBot } from './useChatbots';
import { TUserData } from './useUserData';

const TASK_API = `${HOST}/v1/task`

export interface ITask{
    storedToken: string,
    userMessage: string,
    taskTrigger: boolean
    setTaskTrigger: React.Dispatch<React.SetStateAction<boolean>>,
    chatbot: IBot,
    searchResults: IPassage[]
}

export interface IPassage {
    id: string,
    title: string,
    text: string,
    score: number,
    n_tokens: number,
}

interface IResponse {
    answer: string
}

interface ITaskRequest {
    upstream_version: string,
    user_message: string,
    chatbot_id: string,
    model_id: string,
    search_results: IPassage[]
    sources: TUserData[] 
    system_message: string
    temperature: number
}

export default function useTask({ storedToken, userMessage, searchResults, taskTrigger, setTaskTrigger, chatbot}: ITask) {
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<string>('') 

    useEffect(() => {
        if (userMessage=== '' || searchResults.length === 0 || !taskTrigger) { return }
        let body: ITaskRequest = {
            "upstream_version": '0.3.5',
            "user_message": userMessage,
            "search_results": searchResults,
            "chatbot_id": chatbot.id,
            "model_id": chatbot.model_id,
            "sources": chatbot.sources,
            "system_message": chatbot.system_message,
            "temperature": chatbot.temperature,
        }
        postToEndpoint(
            TASK_API,
            body
        )
            .then((response: IResponse) => {
                setAnswer(response.answer)
            }
            )
    }
        , [taskTrigger])

    async function postToEndpoint(
        endpoint: string,
        body: object,
        method: string = 'POST'
    ) {
        setLoading(true)
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify(body),
        }).then((res) => {
            setLoading(false)
            if (res.ok) { return Promise.resolve(res.json()) }
            else { return Promise.reject(res.json()) }
        }).finally(() => {
            setTaskTrigger(false)
        })
        return response
    }

    return { loading, answer}
}