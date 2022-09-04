const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const nurseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    address: {
        type: String,
        required: true,
        trim: true
    },
    balance: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// nurse who is accepting appointment
nurseSchema.virtual('appointments', {
    ref: 'Appointments',
    localField: '_id',
    foreignField: 'nurse'
})

// nurse who is being payed
nurseSchema.virtual('payments', {
    ref: 'Payment',
    localField: '_id',
    foreignField: 'payed_to'
})


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