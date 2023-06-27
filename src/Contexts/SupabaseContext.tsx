import React, { createContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { HOST, PUBKEY, SUPA_CLIENT } from '../constants';
import { Navigate, useLocation } from 'react-router-dom';


const supabase = createClient(SUPA_CLIENT, PUBKEY); 

export const Login = () => {
    // get the current path from the query string
    const useQuery = () => new URLSearchParams(window.location.search);
    const query = useQuery();
    const redirect = query.get('redirect');

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            if (session && session.user.confirmed_at && redirect) {
                window.location.replace(redirect)
            } else if (session && session.user.confirmed_at) {
                window.location.replace('/')
            }
        })
        return () => { subscription?.unsubscribe() }
    }, [redirect])

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <h1 className='text-3xl font-bold'>Welcome</h1>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa, className: { container: 'w-[400px]' } }}
                providers={['google']}
            />
        </div>
    )
}

export const PrivateRoute = ({ children }: any) => {
    const { session } = React.useContext(SupabaseContext);
    // origin
    const { pathname } = useLocation();
    const to = encodeURIComponent(pathname);
    // navigate to login and add to query string the current path
    return session ? children : <Navigate to={`/login?redirect=${to}`} />;
};

export const SupabaseContext = createContext<any>(null);

type AuthContextProviderProps = {
    children: React.ReactNode;
};

// Create the Supabase provider
export const SupabaseProvider = ({ children }: AuthContextProviderProps) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Check if the user is authenticated on component mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            // wait 1 second to hide the loading animation
            setTimeout(() => setLoading(false), 500)
        })

        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
            const handleCreate = async () => {
                if (!session?.user?.confirmed_at) { return }
                const SIGNUP_ENDPOINT = `${HOST}/v1/account`
                const response = await fetch(SIGNUP_ENDPOINT, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${session?.access_token}`, },
                })
                if (response.ok) { setSession(session); }
            }
            handleCreate()
            setSession(session)
        })
        return () => subscription.unsubscribe()
    }, [])


    const handleLogout = async () => {
        await supabase.auth.signOut()
        setSession(null)
        window.location.replace('/')
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900"></div>
                <h1 className='text-xl font-bold mt-3'>Loading</h1>
            </div>
        )
    }

    else {
        return (
            <SupabaseContext.Provider value={{ session, handleLogout }}>
                {children}
            </SupabaseContext.Provider>
        )
    }
}