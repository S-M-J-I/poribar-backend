const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    payed_by: {
        type: String,
        trim: true
    },
    payed_to: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    date: {
        type: Date,
    }
}, {
    timestamps: true
})


paymentSchema.pre('save', async function (next) {
    const payment = this

    payment.date = new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    console.log(payment.date)

    next()
})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment