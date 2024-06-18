import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean;
  isAcceptingMessage: boolean;
  messages:Message[]
}

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true,"Username Is Required"],
    unique:true,
    trim:true
  },
  email: {
    type: String,
    unique:true,
    required: [true,"Email Is Required"],
    match:[/.+\@.+\...+/,'please use a valid email address']
  },
  password:{
    type:String,
    // required:[false,"Password Is Required"]
  },
  verifyCode:{
    type:String,
    // required:[false,"verifyCode Is Required"]
  },
  verifyCodeExpiry:{
    type:Date,
    // required:[false,"verifyCodeExpiry Is Required"]
  },
  isVerified:{
    type:Boolean,
    default:false,
    
  },
  isAcceptingMessage:{
    type:Boolean,
    default:true
  },
  messages:[MessageSchema]
});

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);

export default UserModel