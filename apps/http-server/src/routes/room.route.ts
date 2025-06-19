import express from 'express';
import { createRoom } from '../controllers/room.controller.js';

const roomRouter = express.Router();

roomRouter.post('/', createRoom);

export default roomRouter;