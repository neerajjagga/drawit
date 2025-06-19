import { WebSocketServer } from "ws";
import jwt, { type JwtPayload } from "jsonwebtoken";
// import { JWT_SECRET } from '@repo/config/secrets';
import { JWT_SECRET } from '@repo/backend-common/config';

const wss = new WebSocketServer({ port: 6060 });
// const JWT_SECRET = "Draw@123";

wss.on('connection', (ws, request) => {
    const url = request.url;
    if(!url) return;

    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');

    if(!token) return;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
     
    if(!decoded || !decoded.userId) {
        ws.close();
        return;   
    }

    ws.on('message', (data) => {
        ws.send("Hello");
    });
});