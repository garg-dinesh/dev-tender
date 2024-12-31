const express = require("express");
const {userAuth} = require("../middlewares/auth")

const profileRouter = express.Router();

// GET: Profile
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        
        return res.send(user);
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
});

module.exports = profileRouter;