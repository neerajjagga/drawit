import { type Request, type Response } from "express";
import { JWT_SECRET } from '@repo/backend-common/config';

export const signupUser = (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        console.log(JWT_SECRET);
        
    } catch (error) {
        
    }    
}

export const signinUser = () => {
    try {
        
    } catch (error) {
        
    }    
}
