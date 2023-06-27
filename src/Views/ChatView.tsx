import { IMessage } from "../Components/Chat";
import Chat from "../Components/Chat";
import Input from "../Components/Input";
import { useLocation, useParams } from "react-router-dom";
import useConversation from "../Hooks/useConversation";
import { TUserData } from "../Hooks/useUserData";
import { useContext, useEffect, useState } from "react";
import { INITIAL_VALUES } from "../constants";
import { AppContext } from "../Contexts/AppContext";

export interface ISource {
  id: string,
  title: string,
  text: string
}

interface IChatViewProps {
  sources: Array<TUserData>
  messages: IMessage[];
  loading: boolean;
  isSubmit: boolean;
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  userMessage: string;
  setUserMessage: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
  conversationId: string;
}

export default function ChatView({ messages, loading, isSubmit, setIsSubmit, userMessage, setUserMessage, setMessages, conversationId, setConversationId }: IChatViewProps) {
  const { chatbot, setChatbot, bots } = useContext(AppContext)
  const { conversation_id: convIdFromParams } = useParams<{ conversation_id?: string }>();
  const [isConversationChange, setIsConversationChange] = useState(false)
  const { botId: botIdFromConversation, loading: loadingConversation } = useConversation({ setMessages, conversationId, isConversationChange, setIsConversationChange })
  // get state from navigate
  const location = useLocation()

  useEffect(() => {
    if (location.state?.isConversationChange === true) {
      setIsConversationChange(true)
    }
  }, [location])

  useEffect(() => {
    if (convIdFromParams && convIdFromParams !== conversationId) {
      setConversationId(convIdFromParams)
    }
  }, [convIdFromParams, setConversationId])

  useEffect(() => {
    const botFromConversation = bots.find(bot => bot.id === botIdFromConversation)
    if (convIdFromParams && botFromConversation && !loadingConversation) {
      setChatbot(botFromConversation)

    }
    else if (convIdFromParams && !botFromConversation && !loadingConversation) {
      setChatbot(INITIAL_VALUES.default_chatbot)
    }
  }, [convIdFromParams, bots, botIdFromConversation, setChatbot, loadingConversation])

  return (<>
    <div className='relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1'>
      <Chat messages={messages} />
      <Input
        loading={loading}
        isSubmit={isSubmit}
        setIsSubmit={setIsSubmit}
        messages={messages}
        setMessages={setMessages}
        userMessage={userMessage}
        setUserMessage={setUserMessage}
      />
    </div>
  </>
  );
}
