const jwt = require('jsonwebtoken');


module.exports = (req,res, next) => { 
    console.log(req)
    const token = req.headers.authorization; 
    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded; 
        next();
    } catch(error)  {
        return res.status(401).json({ 
            message: "Auth failed"
        })
    }
   

};