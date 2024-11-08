import { Router } from "express";

export const userRouter = Router();

userRouter.post("/metadata",(req,res)=>{
    res.json({
        msg : "update the metadata"
    })
})
userRouter.get("/metadata/bulk?ids=[1, 3, 55]",(req,res)=>{
    res.json({
        msg : "get the other users metadata"
    })
})