const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;    

        if (!token) {
            throw new Error("Token is not valid!")
        }
    
        const decodededObj = await jwt.verify(token, "DEV@TENDER$") ;
        const {_id} = decodededObj;
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User does not exist!!")
        }

        req.user = user;
        next();
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
    
}

module.exports = {
    userAuth
}