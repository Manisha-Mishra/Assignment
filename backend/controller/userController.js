const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const userModel = require("../models/user.model");
const User = require("../models/user.model");
exports.register= async (req, res) => {
    try {
      let { email, password, passwordCheck, displayName } = req.body;
  
      // validate
  
      if (!email || !password || !passwordCheck)
        return res.status(400).json({ msg: "Not all fields have been entered." });
      if (password.length < 5)
        return res
          .status(400)
          .json({ msg: "The password needs to be at least 5 characters long." });
      if (password !== passwordCheck)
        return res
          .status(400)
          .json({ msg: "Enter the same password twice for verification." });
  
      const existingUser = await User.findOne({ email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });
  
      if (!displayName) displayName = email;
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email,
        password: passwordHash,
        displayName,
      });
      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }};

exports.login=async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // validate
      if (!email || !password)
        return res.status(400).json({ msg: "Not all fields have been entered." });
  
      const user = await User.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "No account with this email has been registered." });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{
        expiresIn:'30d'
      });
      console.log("token",token);
      res.status(200).send({
        token:token,
        user: {
          id: user._id,
          isAdmin:user.isAdmin,
          displayName: user.displayName,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

exports.deleteUser=async (req, res) => {
    try {
      if(req.user.isAdmin){
        let user=await User.remove({_id:req.params.id})
        res.status(200).json({msg:'successfully deleted user',user})
        
    }else{
      res.status(400).json({error:"Only Admin can delete and update user"})
    }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
exports.updateUser=async (req, res) => {
    try {
      if(req.user.isAdmin){
          let user=await User.findById(req.params.id)
          if(user){
            user.email=req.body.email||user.email
            user.displayName=req.body.displayName||user.displayName
            let updatedUser=await user.save()
            res.status(200).json({updatedUser})
          }
          res.status(400).json({err:'No such User is present'})
      }else{
        res.status(400).json({error:"Only Admin can delete and update user"})
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

exports.getProfile=async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
      displayName: user.displayName,
      id: user._id,
    });
  }

exports.getUserDetails=async(req,res)=>{
   
        const user = await User.find();
        res.status(200).json({user})
      
}
exports.isTokenValid=async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }