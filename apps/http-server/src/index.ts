import express from 'express';
import { prisma } from '@repo/db';
import { errorHandler } from './utils/errorHandler.js';

import roomRouter from './routes/room.route.js';
import strokeRouter from './routes/stroke.route.js';

const PORT = 3000;
const app = express();

app.use(express.json());

app.use('/api/room', roomRouter);
app.use('/api/stroke', strokeRouter);

app.use(errorHandler);

prisma.$connect().then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch(() => {
    console.log("Error connecting to db");
    process.exit(1);
});