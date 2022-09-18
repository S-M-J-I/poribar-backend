const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const nurseSchema = new mongoose.Schema({
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
    type: {
        type: String,
        default: 'nurse'
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    balance: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        round: 1
    },
    avatar: {
        type: String,
    },
    ext: {
        type: String,
        default: '.jpg'
    }
}, {
    timestamps: true
})

nurseSchema.methods.updateBalance = async function (amount) {
    const nurse = this

    nurse.balance += amount
    await nurse.save()

}

// hash password before saving
nurseSchema.pre('save', async function (next) {
    const nurse = this

    if (nurse.isModified('password')) {
        nurse.password = await bcrypt.hash(nurse.password, 8)
    }

    next()
})

const Nurse = mongoose.model('Nurse', nurseSchema)

module.exports = Nurse