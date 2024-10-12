import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect( () => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws)
            console.log("socket connected")
        }
        ws.onclose = () => {
            setSocket(null)
            console.log("socket disconnected")
        }
        ws.onerror = (err) => {
            console.error("WebSocket error: ", err);
        };
    }, [])

    return socket;
}

