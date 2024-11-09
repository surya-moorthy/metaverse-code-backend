import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/user";
const prisma = require('@repo/db/client');
export const userRouter = Router();

userRouter.post("/metadata",userMiddleware,(req,res)=>{
    const parsedata = UpdateMetadataSchema.safeParse(req.body);
    if(!parsedata.success){
        res.status(400).json({
            msg: " Invalid credential"
        })
        return
    }
    prisma.user.update({
        where: {
            id: req.userId
        },
        data : {
            avatarId : parsedata.data.avatarId
        }   
    })
    res.json("Metadata updated")
    return 
})
userRouter.get("/metadata/bulk",async (req,res)=>{
    const userIdString = (req.query.ids as "[]") as string ;
    const userIds = userIdString.slice(1,userIdString?.length -2).split(',');
    const metadata = await prisma.user.findMany({
        where : {
            id : {
                in:userIds
            }, select:{
                avatar : true,
                id : true
            }
        }
    })
    res.json({
        avatars : metadata.map((m: { id: any; avatar: { imageUrl: any; }; }) =>({
            usetId : m.id,
            avatarId : m.avatar?.imageUrl
        }) )
    }) 
})