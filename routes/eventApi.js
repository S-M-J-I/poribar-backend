const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const multer = require('multer')
const uploadEvent = multer({ dest: 'images/events' })
const path = require('path')
const image_dirs = require('../middleware/image_filter')


router.post('/create', uploadEvent.single('photo'), async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            photo: req.file.filename,
            ext: req.file.originalname.split('.')[1]
        })

        await event.save()
        res.status(200).send("Registered Event")
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/all', async (req, res) => {
    try {
        let events = []
        Event.find({}).sort('-date').exec((err, docs) => {
            docs.forEach(event => {
                const { _id, name, date, description, location, photo } = event
                let fileBuffer = Buffer.from(photo, 'base64')
                events.push({
                    _id, name, date, description, location, fileBuffer
                })
            })
            res.status(200).send(events)
        })

    } catch (err) {
        res.status(500).send(err)
    }
})


router.post('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const event = await Event.findOne({ _id: id })
        res.send(event)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/image/:id', async (req, res) => {
    const id = req.params.id
    try {

        const reqFor = req.body.reqFor
        const event = await Event.findOne({ _id: id })
        const filename = `${event.photo}`

        // console.log(reqFor)
        console.log(image_dirs)
        console.log('dir: ', __dirname)

        const filepath = `${image_dirs.get(reqFor)}/${filename}`
        fp = path.join(__dirname, '../', filepath)

        console.log(fp)
        res.sendFile(fp, function (err) {
            res.status(500).send(err)
        })

    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router