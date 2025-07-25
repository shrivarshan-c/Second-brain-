import mongoose, { Schema,model } from "mongoose";
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

mongoose.connect("mongodb+srv://shri:csv@cluster0.wsy8rwf.mongodb.net/secondbrain?retryWrites=true&w=majority&appName=Cluster0");

 export const userModel = model("User",userSchema);
