import Navbar from "../Components/Navbar";

export interface ILogin {
    tokenInput: string;
    setTokenInput: (token: string) => void;
    tokenSubmitted: boolean;
    setTokenSubmitted: (tokenSubmitted: boolean) => void;
    loggedIn: boolean;
    authing: boolean;
}

export default function Privacy() {
    return <div className="h-full w-full overflow-auto overflow-y-auto">
        <div className="flex flex-col px-4 mx-auto">
            <Navbar />
            <iframe className="mx-auto h-[60rem] w-full" title="privacydoc" src="https://docs.google.com/document/d/e/2PACX-1vT6asKC8KSh7QdFW74A0rAfwKfa9YtNzKD0m8RLIzKgLfTXkjBtXRP4lHlLyIibWZRUuErBnxs7ULoU/pub?embedded=true"> </iframe>
        </div>
    </div>
}
