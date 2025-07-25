import  jwt  from 'jsonwebtoken';

import { Request,Response,NextFunction } from "express"
import { JWT_Secret } from '.';

export const useMiddleware=(req:Request,res:Response,next:NextFunction)=>{

    const header=req.headers["token"]

    const decodedata= jwt.verify(header as string,JWT_Secret);
    console.log(decodedata)

    if(decodedata){
        //@ts-ignore
       req.userId=decodedata.id,
        next()
    }
    else
    {
        res.status(403).json("you are not logged in ");


    }




}
