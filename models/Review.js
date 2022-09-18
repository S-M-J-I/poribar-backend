const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = mongoose.Schema({
    rating: {
        type: Schema.Types.Decimal128,
        required: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    reviewer: {
        type: String,
        trim: true
    },
    reviewed_to: {
        type: String,
        trim: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review