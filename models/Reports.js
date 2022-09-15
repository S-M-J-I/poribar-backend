const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    patient: {
        type: String,
        trim: true
    },
    nurse: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
})


const Report = mongoose.model('Report', reportSchema)

module.exports = Report