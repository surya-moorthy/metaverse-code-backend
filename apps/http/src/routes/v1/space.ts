import { Router } from "express";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteSchema } from "../../types";
import { userMiddleware } from "../../middleware/user";
const prisma = require( "@repo/db/client");

export const spaceRouter = Router();
spaceRouter.post('/',userMiddleware,async (req,res)=>{
    const parsedata = CreateSpaceSchema.safeParse(req.body);
    if(!parsedata.success){
        res.status(400).json({
            message : "Invalid Creadentials"
        })
        return
    }
    if(!parsedata.data.mapId){
       const space =  await prisma.space.create({
             data : {
                name : parsedata.data.name,
                width : parseInt(parsedata.data.dimension.split("x")[0]),
                height : parsedata.data.dimension.split("x")[1],
                creatorId : req.userId!
             }
        })
        
        return space;

    }
    const map = prisma.map.finUnique({
        where : {
            id : parsedata.data.mapId
        }, selects : {
            mapElements : true,
            width : true,
            height: true
        }
    })
    if(!map){
        res.status(400).json({message : "Map not found"})
        return
    }
    let space = await prisma.$transaction(async ()=>{
        const space = await prisma.space.create({
           data : {
            name : parsedata.data.name,
            width :map.width,
            height :map.height,
            creatorId : req.userId,
           }
    });
    await prisma.spaceElements.createMany({
        data : map.mapElements.map((m : any) =>({
            spaceId : space.id,
            elementId : m.elementId,
            x : m.x!,
            y : m.y!
        }))
    })
    return space;
    })
   res.json({
    sapceid : space.id
   })
})

spaceRouter.delete('/:spaceId',userMiddleware,async (req,res)=>{

    const space = await prisma.space.findUnique({
         where : {
            id : req.params.spaceId
         },
         select: {
            creatorId : true
         }
    })

    if(!space){
        res.status(400).json({
            message : "Space not found"
        })
        return
    }
    if(space.creatorId !== req.userId){
        res.status(400).json({
            message : "Unauthorized"
        })
        return
    }
    await prisma.space.delete({
        where :{
            id : req.params.spaceId
        }
    })
    res.json({
        message: "deleted a space"
    })
})
spaceRouter.get('/:spaceId',async (req,res)=>{
    const requestedSpace = req.params.spaceId;
    const space = await prisma.space.findUnique({
        where : {
            id : requestedSpace
        },include : {
            elements : true
        }

    })
     if(!space){
         res.status(400).json({msg : "Space not found"})
         return
     }
    res.json({
        "dimensions" : `${space.width}x${space.height}`,
        "elements" : space.elements.map((e:any) =>(
            {
                id : e.id,
                element :
                    {
                        id : e.element.id,
                        imageUrl:e.element.imageUrl,
                         static:e.element.static,
                         width : e.element.width,
                         height : e.element.height
                    },
                x : e.x!,
                y:e.y!


            }
        ))
    })
})
spaceRouter.get('/all',userMiddleware,async (req,res)=>{
   const spaces = await prisma.space.findMany({
    where:{
        creatorId : req.userId
    }
   })
   res.json({
    spaces : spaces.map( (space : any)  =>({
        spaceId : space.id,
        name : space.name,
        thumbnail : space.thumbnail,
        dimensions : `${space.width}x${space.height}`
    }))
   })
})
spaceRouter.post('/element',userMiddleware,async (req,res)=>{
    const parsedata = CreateElementSchema.safeParse(req.body);
    if(!parsedata.success){
        res.json({ msg : "Validation error"}).status(400)
    }
    const space = await prisma.space.findUnique({
        where:{
            id : req.body.spaceId,
            creatorId : req.userId!,
        },
        select :{
            width : true,
            height : true
        }
    })
    if(!space){
        res.json({msg : "Space not found"}).status(400)
    }
    await prisma.spaceElement.create({
        data: {
            spaceId : req.body.spaceId,
            elementId : req.body.elementId,
            x : req.body.x,
            y : req.body.y
        }
    })

    res.json({msg : "space added"}).status(200)

})
spaceRouter.delete('/element',userMiddleware,async (req,res)=>{
      const parseData= DeleteSchema.safeParse(req.body);
      if(!parseData.success){
        res.json({msg :"Validation Error"}).status(400);
      }
      const spaceElement = await prisma.spaceElements.findFirst({
        where: {
            id : parseData.data?.id
        },
        include : {
            space : true
        }
      })
      if(spaceElement.space?.creatorId || spaceElement.space.creatorId !== req.userId){
        res.status(400).json({msg : "Unauthorized"})
      }
      await prisma.spaceElements.delete({
        where : {
            id : parseData.data?.id 
        }
      })
    res.json({msg : "An element is deleted"}).status(200)
})

