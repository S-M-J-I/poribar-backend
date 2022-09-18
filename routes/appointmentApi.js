const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Appointment = require('../models/Appointments')
const Nurse = require('../models/Nurse')
const multer = require('multer')
const User = require('../models/User')
const uploadAppointment = multer({ dest: 'images/appointments' })

router.post('/create', /* auth, */uploadAppointment.none(), async (req, res) => {

    const appointment = new Appointment(req.body)

    try {
        await appointment.save()

        res.status(200).send({ message: "Appointment created" })
    } catch (err) {
        res.status(500).send(err)
    }
})
async function getNurse(id) {
    console.log(id)
    const nurse = await Nurse.findOne({ uid: id })
    return nurse
}

async function getAppointments(id) {
    const appointments = await Appointment.find({ customer: id })
    await Promise.all(appointments.map(async appointment => {
        appointment.nurse = (await getNurse(appointment.nurse)).name
    }))
    return appointments;
}
// user side
router.post('/user/getall/:uid', async (req, res) => {
    try {
        console.log(req.params.uid)
        const appointments = await getAppointments(req.params.uid)
        res.status(200).send(appointments)
    } catch (err) {
        res.status(500).send(err)
    }
})


router.post('/nurse/getall/:uid', async (req, res) => {
    try {

        const appointments = await Appointment.find({ nurse: req.params.uid })
        const res = []

        await Promise.all(appointments.forEach(async appointment => {
            const user = await User.findOne({ uid: appointment.customer })
            if (user) {
                appointment.customer = user.name
                res.push(appointment)
            }
        }))
        res.status(200).send(res)
    } catch (err) {
        res.status(500).send(err)
    }
})


router.post('/get/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
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