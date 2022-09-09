const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')
const User = require('../models/User')
const Nurse = require('../models/Nurse')


router.post('/pay', async (req, res) => {
    try {
        const payments = new Payment(req.body)
        console.log(req.body)

        await payments.save()
        const user = await User.findOne({ uid: req.body.payed_by })
        const nurse = await Nurse.findOne({ uid: req.body.payed_to })
        await nurse.updateBalance(req.body.amount)

        const mailBody = `${user.name} payed ${nurse.name} amount ${req.body.amount}`

        // mail something

        res.status(200).send({ message: mailBody })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports = router