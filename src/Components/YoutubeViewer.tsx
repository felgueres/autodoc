import { useContext, useState, useEffect } from "react"
import { AppContext } from "../Contexts/AppContext"

interface VideoComponentProps {
    embedUrl: string | null
}

const VideoComponent = ({ embedUrl }: VideoComponentProps) => {
    const [videoError, setVideoError] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    const handleVideoError = () => {
        setVideoError(true);
    };

    const handleVideoLoad = () => {
        setVideoLoaded(true);
    }

    return (
        <div>
            {!videoLoaded && !videoError && (
                // Render alternative content or display an error message
                <p>Loading...</p>)}
            {videoError && <p>Looks like this video can't be embedded. Try watching it on YouTube.</p>}
            {embedUrl &&
                <iframe
                    width="100%"
                    style={{ maxWidth: "900px", aspectRatio: "1.77" }}
                    src={embedUrl}
                    title="vid"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onError={handleVideoError}
                    onLoad={handleVideoLoad}
                ></iframe>
            }
        </div>
    );
};

export default function YTViewer() {
    const { chatbot } = useContext(AppContext)
    const baseYTUrl = 'https://www.youtube.com/embed/'
    const [embedUrl, setEmbedUrl] = useState<string|null>(null)

    useEffect(() => {
        if (chatbot?.sources) {
            const source = chatbot.sources[0] 
            const videoId = source?.name.split('v=')[1]?.split('&')[0]
            const embedUrl = `${baseYTUrl}${videoId}`
            setEmbedUrl(embedUrl)
        }
    }, [chatbot])

    if(!embedUrl) return <></>

    return <>
        <div className="mx-auto w-full">
            <div className="max-w-[900px] max-h-[506px] overflow-hidden">
                <VideoComponent embedUrl={embedUrl} />
            </div>
        </div>
    </>
}