const express = require("express");
const bcrypt = require("bcrypt")
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        // validation of data
        validateSignUpData(req);

        const {password, firstName, lastName, emailId} = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating new instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send('User Added Successfully...')
    } catch(err) {
        res.status(400).send('Error saving the user' + err.message)
    }
});

// Login
authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});

        if(!user) {
            throw new Error("Invalid credentials!")
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token);
            return res.send("Login Successfully!")
        } else {
            throw new Error("Invalid credentials!")
        }
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
});

// logout
authRouter.post("/logout", (req, res) => {
    return res
            .cookie("token", null, {
                expires: new Date(Date.now())
            })
            .send("Logout Successfully!!")
})

module.exports = authRouter;