import Messages from "./Message"

export interface IMessage {
    id: number,
    role: string,
    content: string
}

interface IChatProps { messages: Array<IMessage> }

export default function Chat({ messages }: IChatProps) {
    return <>
        <div className="h-full overflow-hidden overflow-y-auto">
            <Messages messages={messages} />
        </div>
    </>
}