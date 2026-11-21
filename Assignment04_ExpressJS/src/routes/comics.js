const express=require("express");const xkcdService=require("../services/xkcdService");const router=express.Router();

router.get("/latest",async(req,res,next)=>{
    try{
        res.json(await xkcdService.getLatest());}
    catch(e){
        next(e);
    }
});

router.get("/random",async(req,res,next)=>{ 
    /* TODO */
    // Retrieve a random comic and return it as JSON.
    try{
        res.json(await xkcdService.getRandom());
        }
    catch(e){
        // Pass any errors to the error handling middleware.
        next(e);
    } 
});

router.get("/search",async(req,res,next)=>{ 
    /* TODO */
    // Extract search parameters and use default pagination values when needed.
    try{
        const q=req.query.q; 
        const page=req.query.page || 1; 
        const limit=req.query.limit || 10; 
        
        res.json(await xkcdService.search(q,page,limit));
    }
    catch(e){
        // Pass any errors to the error handling middleware.
        next(e);
    } 
});

router.get("/:id",async(req,res,next)=>{ 
    /* TODO */
    // Convert the comic ID from the URL parameter to an integer.
    try{
        const parsedId=parseInt(req.params.id,10);
        res.json(await xkcdService.getById(parsedId));
    }
    catch(e){
        // Pass any errors to the error handling middleware.
        next(e);
    }
});

module.exports=router;
