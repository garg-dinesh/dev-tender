const express = require('express')

const app = express();

// app.use((req, res) => {
//     res.send('Hello from the Server!!')
// })

app.use('/test', (req, res) => {
    res.send('This is from test url...')
})

app.use('/', (req, res) => {
    res.send('This is from Dashboard..Changes..')
})

app.listen(3000, () => {
    console.log('Server is successfully listening on the port 3000....')
})