const express = require('express')

const app = express();

app.get('/getUserData', (req, res) => {

    try {
        // Logic of DB call and get user data
        
        throw new Error('Error')
        return res.send('User Data sent..')
    } catch(err) {
        return res.status(500).send('Error Message..')
    }
})

app.use('/', (err, req, res, next) => {
    if (err) {
        res.status(500).send('Something went wrong..')
    }
})

app.listen(3000, () => {
    console.log('Server is successfully listening on the port 3000....')
})