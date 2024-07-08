import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Admin = new Schema({
  ID: { type: String,required:true },
  Name: { type: String, required: true },
  OfficialEmail: { type: String, required: true },
  PhoneNumber: { type: Number, required: true},
  Country: { type: String, required: true},
  createdAt: { type: Date, required: true, default: Date.now }
});

const User = new Schema({
  ID: { type: String , required: true },
  Name: { type: String, required: true },
  PhoneNumber: {type:Number , required: true},
  Email: { type: String, required: true },
  Password: { type: Number||String, required: true },
  Role: {type:String , required:false},
  createdAt: { type: Date, required: true, default: Date.now }
})

const Company = new Schema({
  C_Id: {type: String , required: true},
  companyName:{type:String , required: true} ,
  email:{type:String , required: true} ,
  password:{type:String , required: true} ,
  phone: {type:Number , required: true} ,
  Country: {type:String , required: true}
})

const Call = new Schema({
  Caller_Id:{type: String , required: false},
  Status:{type:String||Number , required: false},
  Phone_Number:{type:String||Number , required: false},
  Message:{type: String , required: false} ,
  Description:{type:String , required: false}
})

const AdminModel = model("Admin", Admin);
const UserModel = model("User", User);
const CompanyModel = model("Company", Company);
const CallModel = model("Call",Call)

export {
  AdminModel,
  UserModel,
  CompanyModel,
  CallModel
};