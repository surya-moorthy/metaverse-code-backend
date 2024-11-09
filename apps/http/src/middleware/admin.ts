


import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "../routes/v1/config";
import jwt from 'jsonwebtoken'

export const adminMiddleware = (req: Request,res: Response,next: NextFunction)=>{
    const header = req.headers['authorization'];
    const token = header?.split(' ')[1] as string ;
    if(!token){
        res.status(401).json({
            message : "Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token , JWT_PASSWORD) as {role : string , userId : string};
        if(decoded.role !== "admin"){
            res.status(403).json({
                message : 'Unauthorized'
            })
        }
        req.userId = decoded.userId;
        next()
    }catch(e){
        res.status(403).json({
            message : "Unauthorized"
        })
        return 
    } 

}