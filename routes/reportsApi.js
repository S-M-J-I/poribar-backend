const express = require('express')
const multer = require('multer')
const Report = require('../models/Reports')
const User = require('../models/User')
const Nurse = require('../models/Nurse')
const router = express.Router()
const uploadReport = multer({ dest: 'images/reports' })
const fs = require('fs')
const path = require('path')

router.post('/add/:id', uploadReport.array('reportImages', 10), async (req, res) => {
    try {
        console.log(req.body)
        const files = []
        req.files.forEach(file => files.push(file.filename))
        const patient = req.params.id
        const report = new Report({
            ...req.body,
            patient,
            images: files,
        })
        await report.save()
        res.status(200).send(report)
    } catch (err) {
        res.status(500).send(err)
    }
})


router.post('/all/:id', async (req, res) => {
    try {
        const user_id = req.params.id
        const reports = await Report.find({ patient: user_id })
        reports.map(async (report) => {
            const nurse = await Nurse.findOne({ _id: report.nurse })
            report.nurse = nurse.name
        })

        res.status(200).send(reports)
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

router.post('/report/:id', async (req, res) => {
    try {
        const report_id = req.params.id
        const report = await Report.findOne({ _id: report_id })
        const images = []
        report.images.forEach((img) => {
            images.push(fs.readFileSync(path.join(__dirname, '../', `images/reports/${img}`), 'base64'))
        })
        console.log(report)
        const patient = await User.findOne({ uid: report.patient })
        const nurse = await Nurse.findOne({ _id: report.nurse })

        res.status(200).send({ report: report, images, patient, nurse })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

module.exports = router