import express from "express";

import authRouter from "./routes/auth.route.js";
import roomRouter from "./routes/room.route.js";

const app = express();

app.use(express.json());

app.use('/api/user', authRouter);
app.use('/api/room', roomRouter);

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});