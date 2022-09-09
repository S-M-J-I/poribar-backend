const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    location: {
        type: String,
        trim: true,
        required: true
    },
    photo: {
        type: String,
        trim: true,
        required: true
    },
    ext: {
        type: String,
        trim: true,
        default: '.jpg'
    }
}, {
    timestamps: true
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event