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
    }

    
},
{timeStamps:true}
);

const Url=mongoose.model("Urls",urlSchema);
module.exports=Url;