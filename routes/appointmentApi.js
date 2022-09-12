const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Appointment = require('../models/Appointments')

router.post('/create', /* auth, */ async (req, res) => {

    const appointment = new Appointment(req.body)

    try {
        await appointment.save()

        res.status(200).send({ message: "Appointment created" })
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/getall', async (req, res) => {
    try {
        const appointments = await Appointment.find({})
        res.status(200).send(appointments)
    } catch (err) {
        res.status(500).send(err)
    }
})


router.post('/get/:id', async (req, res) => {
    try {
        const id = req.params.id
        const appointment = await Appointment.findOne({ _id: id })
        res.status(200).send(appointment)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/accept', async (req, res) => {
    // if PIN from client side is correct, call this api
    try {
        const appointmentId = req.body.appointment_id
        const appointment = await Appointment.findOne({ _id: appointmentId })
        appointment.accepted = true
        appointment.ongoing = true

        await appointment.save()
        res.status(200).send({ message: "Appointment Accepted" })
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/finish', async (req, res) => {
    try {
        const appointmentId = req.body.appointment_id
        const appointment = await Await.findOne({ _id: appointmentId })
        appointment.ongoing = false
        appointment.completed = true

        await appointment.save()
        res.status(200).send({ message: "Appointment finished" })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router