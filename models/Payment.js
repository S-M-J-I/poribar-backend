const mongoose = required('mongoose')

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})


paymentSchema.pre('save', async function () {
    const payment = this

    payment.date = new Date().toJSON().slice(0, 10).replace(/-/g, '/')

    next()
})

const Payment = mongoose.model(paymentSchema)

module.exports = Payment