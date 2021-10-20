const express =require('express');
const { check, validationResult } = require('express-validator');
const AgricultureLand = require('../models/AgricultureLand');
const router =express.Router();
const auth = require('./shared')
const User = require('../models/User')
const Lands = require('../models/AgricultureLand')
const jwt  =  require('jsonwebtoken')
let secret = "HosamEl-Behiry";


//@Route.... POST  Lands
//@desc..... Add Lands
//@acess...  Private 
router.post('/',[auth ,
   check('title',  'Title Is Required').not().isEmpty(),
 check('typeOfTrading','choose The Type of Tading').not().isEmpty(),
],async (req,res)=>{
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({error:errors.array()})
    }

  try {
    const decoded =  jwt.verify(req.headers['authorization'].split(' ')[1],secret );
    req.user = decoded;
    const user= await User.findById(req.user.data._id)
    console.log(user);
    // console.log(user.obj.name);
      const newland = new  Lands({
        title:req.body.title,
        typeOfTrading:req.body.typeOfTrading,
        image:req.body.image,
        longitude:req.body.longitude,
        latitude:req.body.latitude,
        type:req.body.type,
        price:req.body.price,
        measurements:req.body.measurements,
        name:user.name,
        user:user._id,
        mobile:user.mobile
      })
     await newland.save()
      res.json(newland)
  } catch (error) {
      res.status(500).send("Server Error")
  }
})


//@Route...GET lands
//@des     get All AgricultureLands
//@access Public
router.get('/',async(req,res)=>{
    try {
        const land =await Lands.find().sort({ date:-1 })
        res.json(land)
    } catch (error) {
        res.status(500).send('Server Error')
    }
})

//@Route.... GET lands/:land_id
//@desc......get land by Id
//@access... private
router.get('/:id' , verifyToken ,async (req,res)=>{
   try {
    const land = await Lands.findOne({_id:req.params.id});
    if(!land){
        res.status(400).json({msg:"This Land not Found"})
    }
    res.json(land)
} catch (error) {
       res.status(500).send('Server Error')
   }
})

//@Route...Delete lands/:id
//@des     delete Land by id
//@access Private
router.delete('/:id',auth,async(req,res)=>{
    try {
        const land = await Lands.findById(req.params.id)
        if(!land){
            res.status(400).send({msg:"This Land not Found"})
        }
    //Check User
    //  const newDecode =  jwt.verify(req.headers['authorization'].split(' ')[1],secret );
    //  req.user = newDecode;
    //  lo
    //  if(land.user.toString() !== req.user.data._id){
    //     res.status(400).send({msg:"User not Authorized"})
    // }
    await land.remove()
    res.json({msg:"This Land is Removed"})
    } catch (error) {
        if(error.kind === "ObjectId"){
            res.status(400).send({msg:"This Land not Found"})
        }
        res.status(500).send("Server Error")
    } 
})
//@Route...PoST lands/:id
//@des     update Land by id
//@access Private

router.put('/:id',[auth, 
  check('title',  'Title Is Required').not().isEmpty(),
  check('typeOfTrading','choose The Type of Tading').not().isEmpty(),
],async(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(500).json({errors:errors.array()})
  }
    const { 
       title,
      typeOfTrading,
      image,
      longitude,
      latitude,
      type,
      price,
      measurements
    }= req.body
  const updateLand ={
    title,
    typeOfTrading,
    image,
    longitude,
    latitude,
    type,
    price,
    measurements
  }
 try {
       //get land by id
let land = await Lands.findOne({_id:req.params.id});
if(land){
  //Update Land If IT Found
   land = await Lands.findOneAndUpdate(
     {_id:req.params.id},
     {$set : updateLand},
     {new:true}
   ); res.json(land)
  }
  await land.save()
 } catch (error) {
   console.log(error);
   res.status(500).send("Server Error")
 }

})
function verifyToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.split(' ')[1]);
    if (typeof bearerHeader !== undefined) {
        token =  bearerHeader.split(" ")[1];
     if(!token){
         res.status(400).json({msg:"There's No token"})
        }
      req.token = token
      next();
    } else {
      res.json({ error: "Error of type with token" });
    }
  }



module.exports=router
