import React from "react";
import ReactDOM from "react-dom";

const EmbedWrapper = ({ id }: { id: string | undefined }) => {
    const [showWidget, setShowWidget] = React.useState(false);
    const toggleWidget = () => { setShowWidget(!showWidget); }
    if (!id) { return null; }
    return <>
        <div className="fixed bottom-5 right-0 sm:right-5 z-50 flex flex-col justify-end gap-2">
            {
                showWidget ? <div className="w-screen h-[500px] sm:w-[400px] sm:h-[700px] bg-white shadow-widget rounded-b-2xl rounded-t-2xl overflow-clip"> 
                    {/* <Chatbot chatbotId={id} /> */}
                </div> : null
            }
            <div onClick={toggleWidget} className="bg-blue-700 border text-md self-end justify-center py-2 px-4 rounded-full cursor-pointer shadow-xl">
                <div className="flex items-center text-white font-bold gap-2">
                    {
                        showWidget ? <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="24" viewBox="0 96 960 960" width="48"><path d="M200 606v-60h560v60H200Z" /></svg> : <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="20" viewBox="0 96 960 960" width="20"><path d="M484 809q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555 566q31-26 44-51t13-55q0-53-34.5-85T486 343q-49 0-86.5 24.5T345 435l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508 544q-30 26-44.5 51.5T449 663Zm31 313q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z" /></svg>
                            Chat
                        </>
                    }
                </div>
            </div>
        </div>
    </>
}

const script = document.currentScript;
const chatbotId = script?.getAttribute("id") || undefined;
const embedElement = document.createElement("div");
embedElement.id = "embed-upstream-container";
document.body.appendChild(embedElement);

const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0";
link.rel = "stylesheet";
document.head.appendChild(link);

ReactDOM.render(
    <React.StrictMode>
        <EmbedWrapper id={chatbotId} />
    </React.StrictMode>,
    embedElement
);