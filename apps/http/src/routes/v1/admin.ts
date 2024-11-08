import { Router } from "express";


export const adminRouter = Router()

adminRouter.post('/element',(req,res)=>{
    
})
adminRouter.post('/element/:element',(req,res)=>{
    res.json({
        msg : "Signup"
    })
})
adminRouter.post('/avatar',(req,res)=>{
    res.json({
        msg : "Signup"
    })
})
adminRouter.post('/map',(req,res)=>{
    res.json({
        msg : "Signup"
    })
})


