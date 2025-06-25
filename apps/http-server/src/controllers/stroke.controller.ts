import { Request, RequestHandler, Response } from "express";
import { prisma } from "@repo/db";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createStroke: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;

    const room = await prisma.room.findFirst({ where: { id: roomId } });

    if (!room) {
        res.status(404).json({ success: false, message: "Invalid RoomId" });
        return;
    }

    await prisma.stroke.create({
        data: {
            path: {
                "color": "#0D0B72",
                "size": 3,
                "points": [
                    { "x": 10, "y": 20 },
                    { "x": 11, "y": 21 },
                    { "x": 12, "y": 22 }
                ]
            },
            roomId: room.id
        }
    });

    res.status(201).json({
        success: true,
        message: "Stroke created successfully"
    });
});

export const updateStroke: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { strokeId } = req.params;
    const { path } = req.body;

    if (!path) {
        res.status(400).json({ success: false, message: "Stroke path is required to update" });
        return;
    }

    let parsedPath: any;
    try {
        parsedPath = typeof path === 'string' ? JSON.parse(path) : path;
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid JSON in path",
        });
        return;
    }

    const stroke = await prisma.stroke.findFirst({ where: { id: strokeId } });

    if (!stroke) {
        res.status(404).json({ success: false, message: "Stroke not found" });
        return;
    }

    await prisma.stroke.update({ where: { id: stroke.id }, data: { path: parsedPath } });

    res.status(200).json({
        success: true,
        message: "Stroke updated successfully"
    });
});

export const deleteStroke: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { strokeId } = req.params;

    const stroke = await prisma.stroke.findFirst({ where: { id: strokeId } });

    if (!stroke) {
        res.status(404).json({ success: false, message: "Stroke not found" });
        return;
    }

    await prisma.stroke.delete({ where: { id: stroke.id } });

    res.status(200).json({
        success: true,
        message: "Stroke deleted successfully"
    });
});