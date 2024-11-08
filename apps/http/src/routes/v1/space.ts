import { Router } from "express";

export const spaceRouter = Router();
spaceRouter.post('/',(req,res)=>{
   res.json({
    message: "Create a space"
   })
})
spaceRouter.delete('/:spaceId',(req,res)=>{
    res.json({
        message: "delete a space"
    })
})
spaceRouter.get('/:spaceId',(req,res)=>{
    res.json({
        message: "get a space"
    })
})
spaceRouter.get('/all',(req,res)=>{
   res.json({
    message : "get all the spaces existed"
   })
})
spaceRouter.get('/element',(req,res)=>{
   res.json({
    message : "add an element in the space"
   })
})
spaceRouter.delete('/element',(req,res)=>{
   res.json({
    message : "delete an element in the space"
   })
})
