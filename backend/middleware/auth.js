const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

const auth =async (req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        if(!token)
            return res.status(401).json({msg: "No authentication token, access denied"});
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified)
        return res.status(401).json({msg: "Token verification failed, authorization denied"});

        console.log(verified.id)

        req.user =await User.findById(verified.id).select("-password");
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
   
}

module.exports = auth;