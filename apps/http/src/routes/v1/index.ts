import { Router } from "express";
import { spaceRouter } from "./space";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
const prisma = require( "@repo/db/client");
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";
import { compare, hash } from "../../script";
export const router = Router();
router.post('/signup',async (req,res)=>{
    console.log(req.body)
    const parsedata = await SignupSchema.safeParse(req.body);
    if(!parsedata.success){
        console.log(parsedata.error.format());
         res.status(400).json({
            msg : 'Validation failed'
        })
        return
    }
    const hashedpassword = await hash(parsedata.data.password)
    console.log(hashedpassword);

    try { 
        const user = await prisma.user.create({
            data: {
               username : parsedata.data.username,
               password : hashedpassword,
               role : parsedata.data.type === "admin" ? "Admin" : "User"
               
            }
        })
         res.status(200).json({
             userId : user.id
        })
        console.log(user)
        return 

    }catch(e:any){
        res.status(400).json({msg : "Signup failed",
            error : e.message
        })
        return
    }
})

router.post('/signin',async (req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success){
        console.log(parsedData.error.format()); 
        res.status(400).json({message: "Signin failed"})
        return
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                   username : parsedData.data.username
            }
        })
        if(!user){
            res.status(400).json({msg : "User not found"})
            return 
        }
        const isValid = compare(parsedData.data.password,user.password)
        if(!isValid){
            res.status(400).json({msg: "Password is incorrect"})
            return
        }

        const token = jwt.sign({
            userid : user.id,
            role : user.role
        },JWT_PASSWORD)                     
        res.status(200).json({
           token : token
        })

    }
    catch{
        res.json(400)
    }

})
router.get('/avatars',(req,res)=>{
    
    
})
router.get('/elements',(req,res)=>{

})
router.use('/space',spaceRouter)
router.use('/user',userRouter)
router.use('/admin',adminRouter)


