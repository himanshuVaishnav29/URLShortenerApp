
// const{Router}=require("express");
// const router=Router();




// router.get("/",async(req,res)=>{
//     const allUrls=await URL.find({createdBy:req.user._id}).populate("createdBy");

//     // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//     const baseUrl = process.env.BASE_URL || (req.protocol + '://' + req.get('host'));
//     const fullUrl = baseUrl + req.originalUrl;
//     res.render('currentUser',{
//         allUrls:allUrls,
//         fullUrl:fullUrl
//     });
// });




// // app.get("/:shortUrl", async (req, res) => {
// //     const x=await URL.findOneAndUpdate({
// //         shortUrl:req.params.shortUrl
// //     },
// //     { $inc: { visitCount: 1 } }
// //     ,
// //     { new: true })
// //     if(!x){
// //         return res.status(400);
// //     }
// //    res.redirect(x.originalUrl);
// // });


// router.delete("/urls", async (req, res) => {
//     try {
//         await URL.deleteMany({});
//         res.status(200).json({ message: "All entries deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting entries:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// module.exports=router;