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
    date_time: {
        type: String,
        trim: true
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

eventSchema.pre('save', async function (next) {
    const event = this
    const dateTime = event.date

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit" };
    const datetimestring = dateTime.toLocaleDateString('en-US', options)
    const timestring = datetimestring.split(',')

    const formatString = `${timestring[0]}, ${timestring[1]}, ${timestring[2]} AT ${timestring[3]}`
    event.date_time = formatString

    next()
})



const Event = mongoose.model('Event', eventSchema)

module.exports = Event