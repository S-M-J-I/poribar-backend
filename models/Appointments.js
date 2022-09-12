const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    customer: {
        type: String,
        trim: true
    },
    nurse: {
        type: String,
        trim: true
    },
    details: {
        type: String,
        trim: true,
        required: true
    },
    location: {
        type: String,
        trim: true,
        required: true
    },
    pin: {
        type: Number,
        trim: true,
    },
    accepted: {
        type: Boolean,
        default: false
    },
    ongoing: {
        type: Boolean,
        default: false
    },
    comepleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


appointmentSchema.pre('save', async function (next) {
    const appointment = this

    // generate a random 4 digit integer PIN
    const PIN = Math.floor(1000 + Math.random() * 9000)

    appointment.pin = PIN

    next()
})


const Appointments = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointments