const express = require('express')

const app = express();

// b => optional
// app.get('/ab?c', (req, res) => {
//     res.send({firstname: 'Dinesh', lastname: 'Garg'})
// })

// b => more than one times
// app.get('/ab+c', (req, res) => {
//     res.send({firstname: 'Dinesh', lastname: 'Garg'})
// })

// * => can be any thing
// app.get('/a*c', (req, res) => {
//     res.send({firstname: 'Dinesh', lastname: 'Garg'})
// })

// app.get('/user', (req, res) => {
//     console.log('Query: ', req.query)
//     res.send({firstname: 'Dinesh', lastname: 'Garg'})
// })

// app.get('/user/:userId', (req, res) => {
//     console.log('Params: ', req.params)
//     res.send({firstname: 'Dinesh', lastname: 'Garg'})
// })

app.get('/user/:userId/:name', (req, res) => {
    console.log('Params: ', req.params)
    res.send({firstname: 'Dinesh', lastname: 'Garg'})
})

app.listen(3000, () => {
    console.log('Server is successfully listening on the port 3000....')
})