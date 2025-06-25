import express from 'express';
import { createStroke, deleteStroke, updateStroke } from '../controllers/stroke.controller.js';

const strokeRouter = express.Router();

strokeRouter.post('/:roomId', createStroke);
strokeRouter.patch('/:strokeId', updateStroke);
strokeRouter.delete('/:strokeId', deleteStroke);

export default strokeRouter;