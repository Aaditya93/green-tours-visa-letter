"use server";
import mongoose, { Document, Model, Schema,Types } from "mongoose";
import dbConnect from "../db";


// Interface for the document
interface ICode extends Document {
  code: number;
}

// Create schema
const codeSchema = new Schema<ICode>({
  code: {
    type: Number,
    required: true,
    unique: true
  }
}, { timestamps: true });

// Create or get existing model

const Code: Model<ICode> = 
    mongoose.models.Code || mongoose.model<ICode>('Code', codeSchema);
    
export default Code;

export const createCode = async() => {
    try{
         await dbConnect();
        const code = await Code.create({
            code: 1000
        });
        return code.code;
    }catch(error){
        console.error("Error creating code:", error);
    }
}

export const incrementCode = async(number:number) => {
    try{
        await dbConnect();
        await Code.findByIdAndUpdate(
            new Types.ObjectId("67586b555b6c118683d1fb96"),
            { $inc: { code: number } },
            { new: true }
        );
     
    }catch(error){
        console.error("Error incrementing code:", error);
    }
}
export const getCode = async() => {
    try{
         await dbConnect();

        const code = await Code.findById(
            new Types.ObjectId("67586b555b6c118683d1fb96"),
        ).lean();
        return code?.code;
    }catch(error){
        console.error("Error fetching code:", error);   

    }
}
