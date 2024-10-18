import { useEffect, useState } from "react";
import { WEB_SOCKET_URL } from "../utils/messages";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect( () => {
        const ws = new WebSocket(WEB_SOCKET_URL);
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

