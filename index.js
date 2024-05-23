const express =require("express");
const mongoose=require("mongoose");
const path=require("path");
const cookieParser=require("cookie-parser");
const URL=require("./models/urlSchema");
const USER=require("./models/userSchema");
const {createHmac} =require("crypto");
const {checkForAuthenticationCookie}=require("./middlewares/auth");
const { createToken } = require("./services/auth");
// const userRoutes=require("./routes/userRoutes");
// const urlRoutes=require("./routes/urlRoutes");

require("dotenv").config();
const app=express();
// app.use(express.static(__dirname));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
 


mongoose    
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.log("Err connecting DB: ",err));



// app.use("/user",userRoutes);
// app.use("/url",urlRoutes);

app.get("/",(req,res)=>{
    // const currentPage = req.path;
    res.render('home',{currentPage:"/",user:req.user});
})

app.get("/signUp",(req,res)=>{
    const currentPage = req.path;
    res.render('signUp',{
        currentPage,
    });
});
app.get("/login",(req,res)=>{
    const currentPage = req.path;
    return res.render('login',{
        currentPage
    });
});


app.post("/signUp",async (req,res)=>{
    const currentPage=req.path;
    let errorMessage="";
    try{
        const body=req.body;
        const existingUser = await USER.findOne({ email: body.email }); 
        if (existingUser) { 
            return res.render("signUp",{error:"User already exists",currentPage});
            // throw new Error("User already exists");
        }
        // console.log(existingUser);
        // if (body.password.length < 5) { 
        //     // throw new Error("Password too short");
        //     return res.render("signUp",{error:"Password too short",currentPage});
        // } 
        await USER.create({ 
            fullName:body.fullName,
            email:body.email,
            password:body.password
        });
        return res.redirect("/login");
    }catch(err){
        // errorMessage = err.message; 
        console.log(err);
        return res.render("signUp",{
            // error:errorMessage,
            currentPage
        });
    } 
});
 

app.post("/login",async (req,res)=>{
    const currentPage = req.path;
    try{
        const {email,password}=req.body;
        const user=await USER.findOne({email});
        console.log(user);
        if(!user){
            throw new Error("USER NOT FOUND");
        } 
        const salt=user.salt;
        const hashedPassword=user.password;
        const userProvidedHash=createHmac('sha256',salt)
            .update(password)
            .digest("hex");
        // console.log("hashed pass",hashedPassword);
        // console.log("user pass",userProvidedHash);
        if(hashedPassword!==userProvidedHash){
            throw new Error("Invalid password");
        }  
        const HOUR = 3600000
        // console.log(user);
        const token=createToken(user);
        const cookieOptions = {
            expires: new Date(Date.now() + HOUR), 
            httpOnly: true 
        };
      
        return res.cookie('token',token,cookieOptions).redirect("/");
    }
    catch(error){
        res.render('login',{
            error:"Invalid email or password );",
            currentPage
            }
        );
    }      
});
  

app.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect("/");
});

app.get("/userHome",async(req,res)=>{
    try{
        const currentPage = req.path;
        const allUrls=await URL.find({createdBy:req.user._id}).populate("createdBy");
        // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const baseUrl = process.env.BASE_URL || (req.protocol + '://' + req.get('host'));
        // console.log(baseUrl);
        const fullUrl = baseUrl + req.originalUrl;
        // console.log(fullUrl);
        res.render('currentUser',{
            allUrls:allUrls,
            fullUrl:baseUrl,
            user:req.user,
            currentPage
        });
    }catch(err){
        console.log("Error in /userHome",err);
    }
    
});

app.post("/saveUrl", async(req, res) => {
    const body=req.body;
    await URL.create({
        originalUrl:body.originalUrl,
        createdBy: req.user._id
    })
    res.redirect("/userHome");
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
   res.redirect(x.originalUrl);
});
app.post("/delete/:urlId",async(req,res)=>{
    try{
        const urlId=req.params.urlId;
        // res.end(blogId);
        await URL.findByIdAndDelete(urlId);
        console.log("Url ",urlId," deleted successfully");
        return res.redirect("/userHome");
    }catch(err){
        console.log("Error in /delete/:urlId",err);
    }
});

app.listen(process.env.PORT || 2000,(err)=>{
    if(err){
        console.log("Error starting server:",err);
    }else{
        console.log(`Server listening on port ${process.env.PORT || 2000}`)
    }
})