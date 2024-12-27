const express = require('express')

const app = express();

app.use('/user',
    (req, res, next) => {
        // Route handler
        console.log('Handling the route user')
        // res.send('Response !!')
        next()
``  },
    (req, res) => {
        // Route handler 2
        console.log('Handling the route user')
        res.send('Response2 !!')
    }
)

app.listen(3000, () => {
    console.log('Server is successfully listening on the port 3000....')
})