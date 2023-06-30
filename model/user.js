const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  status:{type:String},
  isActive:{type:Boolean, default:true},
  email: { type: String, unique: true },
  password: { type: String },
  verificationCode:{type:String},
  verified:{type:Boolean, default:false},
  token: { type: String }
});

module.exports = mongoose.model("user", userSchema);