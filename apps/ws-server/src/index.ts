import { WebSocketServer, type WebSocket } from "ws";

interface User {
    ws: WebSocket,
    userId: number,
    rooms?: string[]
}

let users: User[] = [];

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const roomId = url.searchParams.get('room');

    users.push({
        ws,
        userId: Math.round(Math.random() * Math.PI),
        rooms: roomId ? [roomId] : [],
    });

    ws.on('message', (data) => {
        const jsonString = typeof data === "string" ? data : data.toString();
        let parsedData;

        try {
            parsedData = JSON.parse(jsonString);
            console.log(parsedData);
        } catch (error) {
            console.error("Failed to parse message:", error);
        }
        if (!parsedData) return;

        if (parsedData.type === "join_room") {
            const { roomId } = parsedData;
            if (!roomId) return;

            users.forEach(user => {
                if (user.ws === ws) {
                    user.rooms?.push(roomId);
                }
            });

            ws.send(JSON.stringify({
                type: "room_joined",
                message: "Room created successfully",
                roomId,
            }));
        }

        if (parsedData.type === "line") {
            const { points, roomId } = parsedData;
            if (!roomId) return;

            users.forEach(user => {
                if (user.rooms?.includes(roomId) && user.ws !== ws) {
                    user.ws.send(JSON.stringify({
                        points
                    }))
                }
            })
        }
    });

    ws.on('close', () => {
        console.log("WebSocket closed");
    });
});