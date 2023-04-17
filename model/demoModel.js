const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  confirm_password: {
    type: String,
    required: true,
  },
   
  image:{
    type:String,
    required:true
  }

}, {timestamps:true,strict:false});

const demoModel = mongoose.model("User",demoSchema)
module.exports = demoModel
