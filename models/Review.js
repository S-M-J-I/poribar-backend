const mongoose = require('mongoose')

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
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review