const mongoose = require('mongoose');
const validator = require('validator')

const userSchema =  new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Id.." + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value.toLowercase())) {
                throw new Error('Gender data is not valid')
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL invalid" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is default about of the user!"
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;