const express = require('express')

const app = express();

// This will only handle GET call to /user
app.get('/user', (req, res) => {
    res.send({firstname: 'Dinesh', lastname: 'Garg'})
})

app.post('/user', (req, res) => {
    console.log('Save Data in database..')
    res.send('Save Data in database..')
})

// this will match all the cmd
// http methods API call to /test
// app.use('/test', (req, res) => {
//     res.send('This is from test url...')
// })

app.listen(3000, () => {
    console.log('Server is successfully listening on the port 3000....')
})