const jwt = require("jsonwebtoken");
module.exports = function varifyToken(req,res,next){
    const token = req.headers["authorization"];

    if(!token){
        return res.status(403).json({error:"No token provided"});
    }jwt.verify(token,process.env.ADMIN_ACCESS_TOKEN_SECRET,(err,decode)=>{
        if(err){
            return res.status(401).json({error:"Unauthorized"})
        }
        req.username = decode.username;
        next();
    });

}
