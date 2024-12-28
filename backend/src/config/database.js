const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://gargdinesh92:l2wrbgGffhRcT6eQ@cluster0.bzp02.mongodb.net/devTender?retryWrites=true&w=majority&appName=Cluster0')
}

module.exports = connectDB;
