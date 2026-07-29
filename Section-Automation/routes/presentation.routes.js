const express=require("express");
const controller=require("../controllers/presentation.controller");

const router=express.Router();

router.post("/update",controller.updatePresentation);

module.exports=router;