const mongoose = require("mongoose");
const landSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    name:{
      type:String,

    },
    mobile:{
      type:Number,
    },
  title: {
    type: String,
    required:true,
  },
  typeOfTrading: {
    type: Number,
    required: true,
    min:1,
    max:2
  },
  image: {
    type: String,
    default: "",
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  type: {
    type: Number,
  },
  price: {
    type: Number,
  },
  measurement: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model('AgricultureLand' , landSchema)