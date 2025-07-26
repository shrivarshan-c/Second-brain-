import mongoose, { Schema,model } from "mongoose";

import dotenv from "dotenv";
dotenv.config();
const userSchema = new Schema({

    username:{type:String,unique:true},
    password:String
})


const ContentSchema = new Schema({

    type:String,
	link: String,
	title: String,
	tags: [{type:mongoose.Types.ObjectId,ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId,ref:'User',require:true}
})

export const ContentModel = model("Content",ContentSchema);

mongoose.connect(process.env.DB_URL as string);

 export const userModel = model("User",userSchema);
