const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String },
  isAdmin:{type:Boolean,required:true,default:'false'}
});

module.exports = User = mongoose.model("user", userSchema);