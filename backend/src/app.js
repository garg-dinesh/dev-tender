const express = require('express')
const connectDB = require('./config/database')

const User = require('./models/user');

const app = express();

app.post('/signup', async (req, res) => {
    // Creating new instance of User model
    const user = new User({
        firstName: 'Dinesh',
        lastName: 'Garg',
        emailId: 'dinesh@garg.com',
        password: 'dinesh@123'
    });

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
