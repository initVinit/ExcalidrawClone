import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middelware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";

const app = express();

app.post("/signup", async (req, res)=>{
    //db call

    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
    
    try {

        await prismaClient.user.create({
            data:{
                email: parsedData.data.username,
                name: parsedData.data.name,
                password: parsedData.data.password
            }
        })
        
    } catch (e) {
        res.status(411).json({
            message: "Error while logging in"
        })
    }

    res.json({
        userId:123
    });
})

app.post("/signin", (req, res)=>{

    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
    const userId = 1;
    const token = jwt.sign({userId}, JWT_SECRET);
    res.json({
        token
    })
})

app.post("/room", middleware, (req, res)=>{
    //db call

    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }

    res.json({
        roomId : 123
    });
})

app.listen(3001);