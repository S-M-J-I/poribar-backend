const express = require('express')
const multer = require('multer')
const Report = require('../models/Reports')
const Nurse = require('../models/Nurse')
const router = express.Router()
const uploadReport = multer({ dest: 'images/reports' })

router.post('/add', uploadReport.array('reportImages', 10), async (req, res) => {
    try {
        console.log(req.body)
        const files = []
        req.files.forEach(file => files.push(file.filename))
        const report = new Report({
            ...req.body,
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

router.post('/report/:id/:reportid', async (req, res) => {
    try {
        const user_id = req.params.id
        const report_id = req.params.reportid
        const report = await Report.findOne({ patient: user_id, _id: report_id })
        const images = []
        report.images.forEach((img) => {
            images.push(fs.readFileSync(path.join(__dirname, '../', `images/reports/${img}`), 'base64'))
        })

        res.status(200).send({ report, images })
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

module.exports = router