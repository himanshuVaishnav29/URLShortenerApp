const express =require("express");
const mongoose=require("mongoose");
const path=require("path");
const shortId=require("shortid");
const fs=require("fs");
const URL=require("./models/urlSchema");
require("dotenv").config();
const app=express();
// app.use(express.static(__dirname));
app.use(express.urlencoded({extended:false}));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));



mongoose    
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.log("Err connecting DB: ",err));


app.get("/",async(req,res)=>{
    const allUrls=await URL.find({});
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('index',{
        allUrls:allUrls,
        fullUrl:fullUrl
    });
})

app.post("/url", async(req, res) => {
    const body=req.body;
    URL.create({
        originalUrl:body.originalUrl
    })
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const allUrls=await URL.find({});
    // res.render('index',{
    //     allUrls:allUrls,
    //     fullUrl:fullUrl
    // });
    res.redirect("/");
});


app.get("/:shortUrl", async (req, res) => {
    const x=await URL.findOneAndUpdate({
        shortUrl:req.params.shortUrl
    },
    { $inc: { visitCount: 1 } }
    ,
    { new: true })
    if(!x){
        return res.status(400);
    }
//     x.visitCount++;
//    x.save();
   
//    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//    const allUrls=await URL.find({});
//    res.render('index',{
//        allUrls:allUrls,
//        fullUrl:fullUrl
//    });
   res.redirect(x.originalUrl);
});


app.delete("/urls", async (req, res) => {
    try {
        // Use Mongoose's deleteMany method to delete all entries
        await URL.deleteMany({});
        res.status(200).json({ message: "All entries deleted successfully" });
    } catch (error) {
        console.error("Error deleting entries:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(process.env.PORT || 2000,(err)=>{
    if(err){
        console.log("Error starting server:",err);
    }else{
        console.log(`Server listening on port ${process.env.PORT || 2000}`)
    }
})