import express from 'express';
import { createRoom, getRoom } from '../controllers/room.controller.js';

const roomRouter = express.Router();

roomRouter.post('/', createRoom);
roomRouter.get('/:roomId', getRoom);

export default roomRouter;