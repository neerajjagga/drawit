import { type Request, type Response } from "express";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prisma } from '@repo/db/prisma';

export const signupUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        console.log(JWT_SECRET);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        
    } catch (error) {
        
    }    
}

export const signinUser = () => {
    try {
        
    } catch (error) {
        
    }    
}
