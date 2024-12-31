const express = require('express')
const connectDB = require('./config/database')

const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation')
const bcrypt = require('bcrypt');
const cokkieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json ())
app.use(cokkieParser());

app.post('/signup', async (req, res) => {
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
})

// Login
app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});

        if(!user) {
            throw new Error("Invalid credentials!")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = await jwt.sign({_id: user._id}, "DEV@TENDER$", {
                expiresIn: "1d",
            });

            res.cookie("token", token);
            return res.send("Login Successfully!")
        } else {
            throw new Error("Invalid credentials!")
        }
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
});

// GET: Profile
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        
        return res.send(user);
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;

    res.send(user.firstName)
})

connectDB()
    .then(() => {
        console.log('Database connect successfully established...')
        app.listen(3000, () => {
            console.log('Server is successfully listening on the port 3000....')
        })
    })
    .catch((err) => {
        console.log('Database can not be connected...', err)
    })
