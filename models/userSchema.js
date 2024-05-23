const mongoose=require('mongoose');
const {createHmac,randomBytes}=require("crypto");

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    salt:{
        type:String
    },
    password:{
        type:String,
        required:true
    }
});

// RUNS BEFORE SAVING DATA INTO DB
userSchema.pre('save',function(next){
    const user=this;
    if(!user.isModified('password')) return;

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt)   //(algo,keyForHashing)
        .update(user.password)
        .digest("hex");

    console.log(hashedPassword);
    this.salt=salt;
    this.password=hashedPassword;
    next();
});

const user=mongoose.model("users",userSchema);
module.exports=user;
