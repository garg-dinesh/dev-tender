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

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const user = req.user;

        const isPasswordValid = await user.validatePassword(oldPassword);

        if (!isPasswordValid) {
            throw new Error("Invalid Credentails!")
        }

        const passwordHash = await user.getPasswordHash(newPassword);

        user.password = passwordHash;
        await user.save();

        return res.json({message: "Password updated successfully!"})
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = profileRouter;