import { createContext } from "react";
import useAccount, { IUsage } from "../Hooks/useUsage";
import { plans } from "../constants";
import { IPlan } from "../constants";

type AuthContextType = {
    userGroup: string;
    credits: number;
    setCredits: (credits: number) => void;
    fetchingAccount: boolean;
    usage: IUsage;
    myPlan: IPlan;
};

export const AccountContext = createContext<AuthContextType>({
    userGroup: 'free',
    credits: 0,
    setCredits: () => { },
    usage: {
        n_chatbots: 0,
        n_sources: 0,
        n_messages: 0,
        n_tokens: 0,
        user_id: ''
    },
    myPlan: plans['free'],
    fetchingAccount: false
});

type AuthContextProviderProps = {
    children: React.ReactNode;
};

export const AccountContextProvider = ({ children }: AuthContextProviderProps) => {
    const { userGroup, fetchingAccount, credits, setCredits, usage } = useAccount();
    const myPlan = plans[userGroup]

    return (
        <AccountContext.Provider value={{ userGroup, credits, fetchingAccount, setCredits, usage, myPlan }}>
            {children}
        </AccountContext.Provider>
    );
};