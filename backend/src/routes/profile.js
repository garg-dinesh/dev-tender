const express = require("express");
const {userAuth} = require("../middlewares/auth")
const {validateEditProfileData} = require("../utils/validation");

const profileRouter = express.Router();

// GET: Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        
        return res.send(user);
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        return res.json({
            message: `${loggedInUser.firstName}, Your profile is updated successfully!`,
            data: loggedInUser
        })
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
})

module.exports = profileRouter;