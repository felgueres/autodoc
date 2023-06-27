import React, { useState, useEffect, useContext } from 'react'
import useUpload from '../Hooks/useUpload'
import { MAX_FILE_SIZE } from '../constants'
import { useNavigate } from 'react-router-dom'
import URLEntry from '../Components/WebUploader'
import { AppContext } from '../Contexts/AppContext'

interface IDataModalProps {
    storedToken: string
    isUpload: boolean
    setIsUpload: (isUpload: boolean) => void
    handleModalClose: () => void
    setNewDataHash: (newDataHash: string) => void
}

export default function DataModal({ setNewDataHash, storedToken, isUpload, setIsUpload, handleModalClose }: IDataModalProps) {
    const { msgs, setMsgs } = useContext(AppContext)
    const [file, setFile] = useState<File | null>(null)
    const [uploadErrorMsg, setUploadErrorMsg] = useState('')
    const [openPlainText, setOpenPlainText] = useState(false)
    const [openWebsiteModal, setOpenWebSiteModal] = useState(false)
    const navigate = useNavigate()

    useUpload({ storedToken, file, isUpload, setIsUpload, setNewDataHash,
        onProgress: (ProgressEvent: ProgressEvent) => {
            const percentCompleted = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            console.log('percentCompleted', percentCompleted)
        }
    })

    useEffect(() => {
        if (isUpload) {
            setFile(null)
            handleModalClose()
            setIsUpload(false)
            navigate('/sources')
            setMsgs([...msgs, { message: 'Data uploaded successfully', type: 'success', duration: 2000 }])
        }
        if (uploadErrorMsg) {
            alert(uploadErrorMsg)
            setIsUpload(false)
            setUploadErrorMsg('')
        }
    }, [isUpload, uploadErrorMsg])

    function handlePDFInput() {
        const pdfInput = document.getElementById('pdfInput')
        pdfInput?.click()
    }

    function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
        const pdfFileInput = event.target.files?.[0]
        if (!pdfFileInput) return null
        if (pdfFileInput?.size > MAX_FILE_SIZE) {
            alert(`File size too large. ${MAX_FILE_SIZE / 1000000}MB max.`)
            event.target.value = ''
        } else {
            setFile(pdfFileInput)
        }
    }

    function AddDataSources() {
        return <>
            <div className='pb-2 border-b flex justify-between'>
                <div>
                    <h3 className="text-lg font-bold text-zinc-700">Import data</h3>
                    <p className="text-sm">This will upload and process your data</p>
                </div>
                <button className='self-start py-0 px-1 rounded hover:bg-zinc-200 text-sm whitespace-nowrap cursor-pointer transition duration-300' onClick={() => handleModalClose()}>
                    <span className="material-symbols-rounded text-lg">close</span>
                </button>
            </div>

            <div onClick={handlePDFInput} className='flex gap-2 mt-4 cursor-pointer'>
                <div className='self-start px-3 py-2 rounded-sm bg-green-600 text-white' id='icon'> <span className="material-symbols-rounded text-lg">picture_as_pdf</span> </div>
                <div className='flex flex-col' >
                    <span className="text-sm font-semibold text-zinc-700">PDF files</span>
                    <span className='text-sm'>Add a PDF file. Max size: {MAX_FILE_SIZE / 1000000}MB</span>
                    <input className='hidden' onChange={handleFile} type="file" accept=".pdf" required name='inputFile' id="pdfInput" />
                </div>
            </div>

            <div onClick={() => setOpenPlainText(true)} className='flex gap-2 mt-4 cursor-pointer'>
                <div className='self-start px-3 py-2 rounded-sm  bg-sky-500 text-white' id='icon'> <span className="material-symbols-rounded text-lg">description</span> </div>
                <div className='flex flex-col' >
                    <span className="text-sm font-semibold text-zinc-700">Plain text</span>
                    <span className='text-sm'>Copy/paste plain text.</span>
                </div>
            </div>

            <div onClick={() => setOpenWebSiteModal(true)} className='flex gap-2 mt-4 cursor-pointer'>
                <div className='self-start px-3 py-2 rounded-sm  bg-indigo-500 text-white' id='icon'> <span className="material-symbols-rounded text-lg">public</span> </div>
                <div className='flex flex-col' >
                    <span className="flex items-center text-sm font-semibold text-zinc-700">Website URL (NEW) &nbsp;
                        <span className='material-symbols-rounded text-xl text-purple-500'>new_releases</span>
                    </span>
                    <span className='text-sm'>Crawl a website</span>
                </div>
            </div>
        </>
    }

    const TextArea = () => {
        const [value, setValue] = useState('')
        const [name, setName] = useState('')
        const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setValue(event.target.value);
        };

        function handleTextAsFile() {
            if (name.length < 1) return alert('Please enter a name for your text.')
            const text = document.getElementById('textarea_input') as HTMLTextAreaElement
            const textFile = new File([text.value], `${name}.txt`, { type: 'text/plain' })
            setFile(textFile)
        }

        return (

            <>
                <div className='flex flex-col p-4 sm:min-w-[420px] sm:min-h-[420px] gap-1'>
                    <div className='pb-2 border-b flex justify-between'>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-700">Add plain text</h3>
                            <p className="text-sm">You can upload any text format: TXT, JSON, CSV, HTML, etc. AI does a great job even if the text is messy or unstructured.</p>
                            <small className='text-sm'>Max words per upload: 50K words</small>
                        </div>
                        <button className='self-start py-0 px-1 rounded hover:bg-zinc-200 text-sm whitespace-nowrap cursor-pointer transition duration-300' onClick={() => handleModalClose()}>
                            <span className="material-symbols-rounded text-lg">close</span>
                        </button>
                    </div>

                    <div className='flex flex-col'>
                        <div className="mt-2">
                            <span className="text-sm font-semibold text-zinc-700">Name</span>
                        </div>
                        <div>
                            <input
                                type="text"
                                className="text-sm border min-w-[250px] px-2 rounded-sm mt-2 leading-6"
                                required
                                value={name}
                                placeholder='Enter name'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mt-2">
                            <span className="text-sm font-semibold text-zinc-700">Text</span>
                        </div>
                        <textarea autoFocus id="textarea_input" className='p-2 mt-2 border rounded-sm h-48 text-xs' value={value} onChange={handleChange} maxLength={1000000} />

                    </div>

                    <div className="flex w-full pt-1 px-1">
                        <div className="flex gap-2 mt-6">
                            <button onClick={handleTextAsFile} className="bg-indigo-700 text-white py-2 px-4 rounded hover:opacity-90 text-sm whitespace-nowrap cursor-pointer">
                                Apply
                            </button>
                            <button onClick={() => setOpenPlainText(false)} className="py-2 px-4 rounded hover:opacity-90 text-sm whitespace-nowrap cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </>
        )
    }

    if (openPlainText) return <TextArea />
    if (openWebsiteModal) return <URLEntry />

    return <>
        <div className='flex flex-col p-4 sm:min-w-[420px] sm:min-h-[420px] gap-1'>
            <AddDataSources />
        </div>
    </>
}