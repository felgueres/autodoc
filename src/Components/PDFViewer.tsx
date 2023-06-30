import { useCallback, useContext, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import usePDF from "../Hooks/usePDF";
import { AppContext } from "../Contexts/AppContext";
import { useWindowWidth } from "@wojtekmaj/react-hooks";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export type THighlighItem = {
    text: string
    page_number: number
}

export default function PDFViewer({ highlightItem }: { highlightItem?: THighlighItem | null}) {

    const { chatbot } = useContext(AppContext)
    const [sourceId, setSourceId] = useState<string | null>(null)
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const { pdfURL } = usePDF({ sourceId })
    const [loadError, setLoadError] = useState(false)
    const [searchText, setSearchText] = useState<string>('')

    useEffect(() => {
        if (chatbot) { setSourceId(chatbot.sources[0]?.source_id as string) }
    }, [chatbot])

    useEffect(() => {
        if (highlightItem) {
            setPageNumber(highlightItem.page_number)
            setSearchText(highlightItem.text)
        }
    }, [highlightItem])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function highlightPattern(text: string, pattern: string) {
        // split the pattern into words and create a regex pattern that matches full words only
        const words = pattern.split(' ')
        const wordPattern = new RegExp(`\\b(${words.join('|')})\\b`, 'gi')
        console.log(wordPattern)
        
        return text.replace(wordPattern, (value) => `<mark>${value}</mark>`)
    }

    const textRenderer = useCallback((textItem: any) => highlightPattern(textItem.str, searchText), [searchText])

    const width = useWindowWidth() || 0

    function PageControls() {
        return <div className="flex items-center gap-3 p-2 bg-zinc-100 rounded-sm">
            <p className="text-gray-500 text-sm">Page {pageNumber} of {numPages}</p>
        </div>
    }

    function handleError() {
        setLoadError(true)
    }


    if (loadError) return <div className="flex flex-col items-center justify-center">
        <p className="text-gray-500 text-sm">Couldn't load the document.</p>
    </div>

    if(!chatbot) return null 

    return <>
        <div className="flex flex-col">
            <PageControls />
            <div>
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div className="w-full h-full">
                <Document renderMode="canvas" onLoadSuccess={onDocumentLoadSuccess} file={pdfURL} onLoadError={handleError} >
                    <Page 
                        width={Math.min(width * 0.45, 1000)}
                        scale={1}
                        pageNumber={pageNumber} 
                        customTextRenderer={textRenderer}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </div>
        </div>
    </>
}
