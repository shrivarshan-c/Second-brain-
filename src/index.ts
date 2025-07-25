
import express from "express";
import  Jwt  from "jsonwebtoken";

import bcrypt from "bcrypt";

import { ContentModel, userModel } from "./db";
import { useMiddleware } from "./middleware";

const app=express();


 export const JWT_Secret="shrivarshancsv";
app.use(express.json());



app.post("/api/v1/signup",async (req,res)=>{
    const username= req.body.username;
    const password= req.body.password;

    const hashpassword= await  bcrypt.hash(password,5);


    try{
        await userModel.create({
            username:username,
            password:hashpassword
        })

        res.json("user signup").status(200);

    }catch(e)
    {
        res.json("some problem"+e).status(404);

    }


})
app.post("/api/v1/signin",async(req,res)=>{

    try{
   const username= req.body.username;
    const password= req.body.password;
 const findUser= await userModel.findOne({
    username:username,
 })
 if(!findUser)
    {
        return res.status(404).json("User not found");
    }
 //@ts-ignore
    const decrypt = await bcrypt.compare(password, findUser.password);

 if(decrypt)
 {
    const token=Jwt.sign({
        id:findUser._id},
        JWT_Secret);
 return  res.status(200).json({token});
}
else
{
return   res.json({
        "message":"Incorrect authorization"
    }).status(403)
}
    }catch(e){
        res.status(404).json("servor error")
    }

})


app.post("/api/v1/content",useMiddleware,async(req,res)=>{

    const type=req.body.type;
    const link=req.body.link;
    const title=req.body.title;
    const tags=req.body.tags;


    const createContent= await ContentModel.create({
        type:type,
        link:link,
        title:title,
        tags:[],
        //@ts-ignore
        userId:req.userId
    })

    if(createContent)
    {
        res.status(200).json("contents added successfully")
    }
    else
    {
        res.status(404).json("content not added");
    }
})

app.get("/api/v1/content",useMiddleware,async(req,res)=>{

    //@ts-ignore
    const userId=req.userId;
    const content = await ContentModel.findOne(
        {
          userId
        }
    ).populate("userId" ,"username")

    if(content)
    {
        res.status(200).json(content)
    }
    else
    {  res.status(404).json("user id not found");
    }
})


app.delete("/api/v1/delete",(req,res)=>{

})

app.post("/api/v1/brain/share",(req,res)=>{

})

app.get("/api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000,()=>{
    console.log(`app running on port ${3000}`)
})
