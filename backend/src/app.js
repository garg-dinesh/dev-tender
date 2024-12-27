const express = require('express')
const {adminAuth, userAuth} = require('./middlewares/auth')

const app = express();

app.use('/admin', adminAuth)

app.post('/user/login', (req, res) => {
    return res.send('User Logged in successfully..')
})

app.get('/user', userAuth, (req, res) => {
    return res.send('User Data sent..')
})

app.get('/admin/getAllData', (req, res) => {
    return res.send('All Data Sent..')
})

app.get('/admin/deleteUser', (req, res) => {
    return res.send('Deleted a user')
})

app.listen(3000, () => {
    console.log('Server is successfully listening on the port 3000....')
})