const express = require('express')
const connectDB = require('./config/database')

const User = require('./models/user');

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
    const userId = req.body.userId;
    const data = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, data);
        return res.send('User updated successfully..')
    } catch(err) {
        return res.status(400).send('Something went wrong..')
    }
})

app.post('/signup', async (req, res) => {
    // Creating new instance of User model
    const user = new User(req.body);

    try {
        await user.save();
        res.send('User Added Successfully...')
    } catch(err) {
        res.status(400).send('Error saving the user', err.message)
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
