import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { AddElementSchema, CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";
const  prisma = require("@repo/db/client");

export const adminRouter = Router()

adminRouter.post('/element',adminMiddleware,async (req,res)=>{
    const parseData = CreateElementSchema.safeParse(req.body);
    if(!parseData.success){
        res.json({msg : "validation error"}).status(400)
        return
    }
    const element = await prisma.element.create({
        imageUrl : parseData.data?.imageUrl,
        width : parseData.data?.width,
        height : parseData.data?.height,
        static : parseData.data?.static
    })
    res.json({
        id : element.id
    })
})
adminRouter.post('/element/:elementId',async (req,res)=>{
    const parseData = UpdateElementSchema.safeParse(req.body);
    if(!parseData.success){
        res.json({msg : "validation error"}).status(400)
        return
    }
    await prisma.element.update({
        where: {
            elementId : req.params.elementId
        },
        data : {
            imageUrl : req.body.ImageUrl
        }
    })
    res.json({
        mag : "Element updated"
    })
})
adminRouter.post('/avatar',async (req,res)=>{
    const parseData = CreateAvatarSchema.safeParse(req.body);
    if(!parseData.success){
        res.status(400).json({msg : "Validation failed"})
        return
    }
   const avatar =  await prisma.Avatar.create({
        imageUrl : parseData.data?.imageUrl,
        name : parseData.data?.name
    })
    res.json({msg : " avatar created",
         avatarId : avatar.id
    })
})
adminRouter.post('/map',async (req,res)=>{
    const parseData = CreateMapSchema.safeParse(req.body);
    if(!parseData.success){
        res.status(400).json({msg : "Validation failed"})
        return
    }
    const map = await prisma.map.create({
        data : {
            name : parseData.data.name,
            thumbnail : parseData.data.thumbnail,
            // width : ,
            // height : ,
            defaultElements : {
                create : parseData.data.defaultElements.map(
                    e => ({
                        elementId : e.elementId,
                        x : e.x,
                        y : e.y
                    })
                )
            },

        }
    })
})


