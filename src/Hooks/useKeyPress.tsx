import React, { useState, RefObject } from "react";

export default function useKeyPress (targetKey: string, ref: RefObject<HTMLDivElement>) {
    const [keyPressed, setKeyPressed] = useState(false);
    
    // DownHandler and upHandler are called when the key is pressed and released
    // They update the state of the key pressed to true or false (true if targetKey down and false after targetKey is up)
    function downHandler({ key }: { key: string }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }
    const upHandler = ({ key }: { key: string }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    React.useEffect(() => { 
        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener("keydown", downHandler);
            currentRef.addEventListener("keyup", upHandler);
        }

        return () => {
            if(currentRef){
                currentRef.removeEventListener("keydown", downHandler);
                currentRef.removeEventListener("keyup", upHandler);
            }
        };
    });
    return keyPressed;
};