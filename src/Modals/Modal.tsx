import { ReactNode, MouseEvent, useEffect } from 'react';
import ReactDom from 'react-dom';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {

    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    const portalElement = document.getElementById('portal')
    if (!portalElement) return null

    function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    if (!open) return null

    return ReactDom.createPortal(
        <>
            <div className='fixed top-0 left-0 w-full h-full bg-gray-500/90 transition-opacity dark:bg-gray-800/90 opacity-100 z-100' onClick={handleOverlayClick}> </div>
            <div className='min-w-[95%] sm:min-w-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white overflow-y-auto z-1000 rounded-md shadow-lg'>
                {children}
            </div>
        </>,
        portalElement
    )
}