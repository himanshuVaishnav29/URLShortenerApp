const mongoose=require("mongoose");
const shortid=require("shortid");
const urlSchema=new mongoose.Schema({
    originalUrl:{
        type:String,
        required:true,
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true,
        default:shortid.generate
    },
    visitCount:{
        type:Number,
        required:true,
        default:0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},
{timeStamps:true}
);

const Url=mongoose.model("urls",urlSchema);
module.exports=Url;