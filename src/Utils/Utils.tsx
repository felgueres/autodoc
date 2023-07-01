import { cloneElement, useContext, useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../Contexts/AppContext";
import { Icons } from "../constants";

export function truncate(str: string, n: number): string {
    return (str.length > n) ? str.substring(0, n - 1) + '...' : str;
}

export function cleanURL(url: string) {
    return url.replace(/https?:\/\//, "")
}

export function domain(url: string) {
    var domain = url.replace(/https?:\/\//, "").split('/')[0]
    return domain
}

export function removeFileExtension(filename: string) {
    return filename.split('.').slice(0, -1).join('.')
}

export const LoadingLine = ({ loading, center }: { loading: boolean, center: boolean }) => <div className={`gradient-wrapper max-w-200 mt-1 ${center ? 'mx-auto' : ''}`}>
    <div className={`gradient-line ${loading ? 'loading' : ''}`}></div>
</div>

export type TToast = {
    message: string;
    duration: number;
    type: string;
}

export const Toasts = () => {
    const { msgs, setMsgs } = useContext(AppContext)

    useEffect(() => {
        if (msgs.length === 0) return;
        // Remove toast after duration
        const timeout = setTimeout(() => {
            setMsgs(msgs.slice(1))
        }, msgs[0].duration);
        return () => clearTimeout(timeout);
    }, [msgs]);
    if (msgs.length === 0) return null;

    const icons = new Map<string, JSX.Element>([
        ['success', <svg className={`w-6 h-6 fill-current text-green-500`} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M378 810 154 586l43-43 181 181 384-384 43 43-427 427Z" /></svg>],
        ['error', <svg className="w-6 h-6 fill-current text-red-500" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M479.982 776q14.018 0 23.518-9.482 9.5-9.483 9.5-23.5 0-14.018-9.482-23.518-9.483-9.5-23.5-9.5-14.018 0-23.518 9.482-9.5 9.483-9.5 23.5 0 14.018 9.482 23.518 9.483 9.5 23.5 9.5ZM453 623h60V370h-60v253Zm27.266 353q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" /></svg>],
        ['warning', <svg className="w-6 h-6 fill-current text-orange-500" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m40 936 440-760 440 760H40Zm104-60h672L480 296 144 876Zm340.175-57q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5ZM454 708h60V484h-60v224Zm26-122Z" /></svg>],
        ['info', <svg className="w-6 h-6 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M484 809q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555 566q31-26 44-51t13-55q0-53-34.5-85T486 343q-49 0-86.5 24.5T345 435l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508 544q-30 26-44.5 51.5T449 663Zm31 313q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z" /></svg>]
    ]
    )

    const removeMessage = (index: number) => {
        const updatedMsgs = [...msgs];
        updatedMsgs.splice(index, 1);
        setMsgs(updatedMsgs);
    };

    return <div className="fixed flex flex-col gap-2 top-0  mt-2 left-1/2 transform -translate-x-1/2 z-50">
        {msgs?.map((msg, i) =>
            <div key={i} className={`flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow space-x`} role="alert">
                <div className="flex flex-shrink-0">{icons.get(msg.type)}</div>
                <div className="flex items-center pl-4 text-sm font-normal">{msg.message}
                    <button onClick={() => removeMessage(i)} className="flex flex-shrink-0 ml-auto text-gray-400 hover:text-gray-500">
                        {cloneElement(Icons.close, { className: "w-5 h-5" })}
                    </button>
                </div>
            </div>
        )}
    </div>
}
export function since(date: string) {
    // Converts date in s to human readable since data
    var now = new Date();
    var dt = new Date(date)
    // Convert dt to UTC
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    var delta = Math.round((utc_timestamp / 1000) - dt.getTime() / 1000);
    var minute = 60, hour = minute * 60, day = hour * 24;
    var fuzzy;
    if (delta < 30) {
        fuzzy = delta;
        return 'just now'
    } else if (delta < minute) {
        fuzzy = delta + 's ago';
    } else if (delta < 2 * minute) {
        fuzzy = '1m ago'
    } else if (delta < hour) {
        fuzzy = Math.floor(delta / minute) + 'm ago';
    } else if (Math.floor(delta / hour) === 1) {
        fuzzy = '1 hour ago'
    } else if (delta < day) {
        fuzzy = Math.floor(delta / hour) + 'h ago';
    } else if (delta < day * 2) {
        fuzzy = 'yesterday';
    } else if (delta < day * 30) {
        fuzzy = Math.floor(delta / day) + ' days ago'
    } else {
        fuzzy = Math.floor(delta / (day * 30)) + ' months ago'
    }
    return fuzzy
}

export const Actions = ({ text }: { text: string }) => {
    const [success, setSuccess] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setSuccess(true)
    }
    return <div onClick={handleCopy} className="cursor-pointer rounded-sm px-2 py-1 text-sm bg-indigo-700 text-gray-200">
        {!success && <span className="material-symbols-rounded text-sm">content_copy</span>}
        {success && <span className="material-symbols-rounded text-sm">done</span>}
    </div>
}

export async function postToEndpoint(
    endpoint: string,
    body: object,
    method: string = 'POST',
    storedToken: string
) {
    const response = await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(body),
    }).then((res) => {
        if (res.ok) { return Promise.resolve(res.json()) }
        else { throw new Error(res.statusText) }
    }).catch((err) => {
        return Promise.reject(err)
    })
    return response
}

export async function getFromEndpoint(
    endpoint: string,
    storedToken: string
) {
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${storedToken}` },
    }).then((res) => {
        console.log('resbois', res)
        if (res.ok) { return Promise.resolve(res.json()) }

    })
    return response
}

export function scrollIntoViewIfNeeded(element: HTMLElement): void {
    const parent = element.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const parentComputedStyle = window.getComputedStyle(parent);

    const parentBorderTopWidth = parseInt(parentComputedStyle.borderTopWidth, 10);
    const parentBorderLeftWidth = parseInt(parentComputedStyle.borderLeftWidth, 10);
    const parentBorderBottomWidth = parseInt(parentComputedStyle.borderBottomWidth, 10);
    const parentBorderRightWidth = parseInt(parentComputedStyle.borderRightWidth, 10);

    const parentTop = parentRect.top + parentBorderTopWidth;
    const parentLeft = parentRect.left + parentBorderLeftWidth;
    const parentBottom = parentRect.bottom - parentBorderBottomWidth;
    const parentRight = parentRect.right - parentBorderRightWidth;

    const elementRect = element.getBoundingClientRect();
    const elementComputedStyle = window.getComputedStyle(element);

    const elementBorderTopWidth = parseInt(elementComputedStyle.borderTopWidth, 10);
    const elementBorderLeftWidth = parseInt(elementComputedStyle.borderLeftWidth, 10);
    const elementBorderBottomWidth = parseInt(elementComputedStyle.borderBottomWidth, 10);
    const elementBorderRightWidth = parseInt(elementComputedStyle.borderRightWidth, 10);

    const elementTop = elementRect.top + elementBorderTopWidth;
    const elementLeft = elementRect.left + elementBorderLeftWidth;
    const elementBottom = elementRect.bottom - elementBorderBottomWidth;
    const elementRight = elementRect.right - elementBorderRightWidth;

    if (elementTop < parentTop || elementBottom > parentBottom || elementLeft < parentLeft || elementRight > parentRight) {
        element.scrollIntoView({ block: "nearest" });
    }
}

export function isValidUrl(url: string) {
    // This validator must explicity have https to be valid and can have  
    const pattern = new RegExp('^(https:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\/[a-z\\d%_.~+=-]*)*)' // fragment locator
    ); // fragment locator
    return pattern.test(url);
}
