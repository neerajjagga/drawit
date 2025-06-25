import { prisma } from '@repo/db';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Request, RequestHandler, Response } from 'express';

export const createRoom: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const room = await prisma.room.create({
        data: {},
    });

    if(!room) {
        res.status(500).json({ success: false, message: "Unable to create room." });
        return;
    }

    res.status(200).json({
        success: true,
        message: "Room created successfully",
        room
    });
});

export const getRoom: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;

    const room = await prisma.room.findFirst({ where: { id: roomId } });

    if(!room) {
        res.status(404).json({ success: false, message: "Room not found" });
        return;
    }

    const strokes = await prisma.stroke.findMany({ where: { roomId: room.id }, omit: { roomId: true }});

    res.status(200).json({
        success: true,
        message: "Room fetched successfully",
        room: { ...room, strokes },
    });
});