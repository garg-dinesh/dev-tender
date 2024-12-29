const express = require('express')
const connectDB = require('./config/database')

const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation')
const bcrypt = require('bcrypt')

const app = express();

app.use(express.json ())

// Feed API - get all the users from the database
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        return res.send(users)
    } catch(err) {
        return res.status(400).send('Something went wrong..')
    }
})

// Get user by email
app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        // const users = await User.find({emailId: userEmail});

        // if(users.length === 0) {
        //     return res.status(404).send('User not found..')
        // }
        // return res.send(users)

        const user = await User.findOne({emailId: userEmail});

        if (!user) {
            return res.status(404).send('User not found..')
        }
        return res.send(user)
    } catch(err) {
        return res.status(400).send('Something went wrong..')
    }
});

// Delete a user from database
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        return res.send('User deleted successfully..')
    } catch(err) {
        return res.status(400).send('Something went wrong..')
    }
})

// Update a user
app.patch('/user', async (req,res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed..")
        }

        if (data?.skills?.length > 10) {
            throw new Error("Skills can not be more than 10")
        }
        const user = await User.findByIdAndUpdate(userId, data, {
            // returnDocument: "after",
            runValidators: true
        });
        return res.send('User updated successfully..')
    } catch(err) {
        return res.status(400).send('Something went wrong..')
    }
})

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
            return res.send("Login Successfully!")
        } else {
            throw new Error("Invalid credentials!")
        }
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
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
