const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Appointment = require('../models/Appointments')

router.post('/create', auth, async (req, res) => {

    const appointment = new Appointment({
        ...req.body,
        customer: req.user._id,
    })

    try {
        await appointment.save()

        res.status(200).send("Appointment created")
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/myappointments', auth, async (req, res) => {
    // get all appointments of a user/nurse by id
})

module.exports = router