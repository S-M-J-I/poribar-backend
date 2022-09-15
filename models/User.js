const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.length < 6) {
                throw new Error("Make password greater than 6 characters")
            }

            if (value.toLowerCase() === "password") {
                throw new Error("Password cannot be 'password'")
            }
        }
    },
    gender: {
        type: String,
        trim: true
    },
    blood_group: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    avatar: {
        type: String
    },
    ext: {
        type: String,
        default: '.jpg'
    }
}, {
    timestamps: true
})


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    // delete user elements that can't be sent to front end
    delete userObject.password

    return userObject
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Unable to log in. Account does not exists!")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to log in. Invalid email or password!")
    }

    return user
}


// hash password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User