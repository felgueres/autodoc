import { useContext, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import usePDF from "../Hooks/usePDF";
import { AppContext } from "../Contexts/AppContext";
import { useWindowWidth } from "@wojtekmaj/react-hooks";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer() {
    const { chatbot } = useContext(AppContext)
    const sourceId = chatbot.sources[0]?.source_id
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const { pdfURL } = usePDF({ sourceId })
    const [loadError, setLoadError] = useState(false)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function PageControls() {
        return <div className="flex items-center gap-3 p-2 bg-zinc-100 rounded-sm">
            <div className="flex gap-1">
                <button className="bg-gray-200 text-gray-800 py-2 px-3 rounded-l text-sm" onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}
                    disabled={pageNumber <= 1}>
                    Prev
                </button>
                <button className="bg-gray-200 text-gray-800 py-2 px-3 rounded-r text-sm" onClick={() => pageNumber < numPages && setPageNumber(pageNumber + 1)}
                    disabled={pageNumber >= numPages}>
                    Next
                </button>
            </div>
            <div className="flex justify-center">
                <p className="text-gray-500 text-sm">Page {pageNumber} of {numPages}</p>
            </div>
        </div>
    }

    function handleError() {
        setLoadError(true)
    }

    const width = useWindowWidth() || 0

    if (loadError) return <div className="flex flex-col items-center justify-center">
        <p className="text-gray-500 text-sm">Couldn't load the document. <br/> Try asking questions. </p>
    </div>

    return <>
        <div className="flex flex-col">
            <PageControls />
            <div className="w-full h-full">
                <Document renderMode="canvas" onLoadSuccess={onDocumentLoadSuccess} file={pdfURL} onLoadError={handleError} >
                    <Page width={Math.min(width * 0.45, 1000)} scale={1} renderAnnotationLayer={false} renderTextLayer={false} pageNumber={pageNumber} />
                </Document>
            </div>
        </div>
    </>
}