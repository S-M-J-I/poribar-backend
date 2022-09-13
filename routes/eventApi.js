const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const multer = require('multer')
const uploadEvent = multer({ dest: 'images/events' })
const path = require('path')
const image_dirs = require('../middleware/image_filter')

const fs = require('fs')
router.post('/create', uploadEvent.single('photo'), async (req, res) => {
    try {
        console.log(req.body)
        const event = new Event({
            ...req.body,
            photo: req.file.filename,
            ext: req.file.originalname.split('.')[1]
        })
        await event.save()
        res.status(200).send({ msg: 'confirmed' })
    } catch (err) {
        res.status(500).send(err)
    }
})

// get all events
router.post('/all', async (req, res) => {
    try {
        let events = []
        Event.find({}).sort('-date').exec((err, docs) => {
            try{
                docs.forEach(event => {
                    const { _id, name, date, description, location, photo,date_time } = event

                    let fileBuffer = fs.readFileSync(path.join(__dirname, '../', `images/events/${photo}`), 'base64')
                    events.push({
                        _id, name, date, description, location, fileBuffer,date_time
                    })
                })
            } catch(err) {
                console.log(err)
            }   
            res.status(200).send(events)
        })

    } catch (err) {
        res.status(500).send(err)
    }
})

// fetch individual events
router.post('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const event = await Event.findOne({ _id: id })
        event.photo = fs.readFileSync(path.join(__dirname, '../', `images/events/${event.photo}`), 'base64')
        res.send(event)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/going/:id', uploadEvent.none(), async (req, res) => {
    const id = req.params.id
    try {
        const event = await Event.findOne({ _id: id })
        const user_id = req.body._id

        event.going.push(user_id)
        await event.save()
        res.status(200).send({ message: "Going Done" })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.post('/interested/:id', uploadEvent.none(), async (req, res) => {
    const id = req.params.id
    try {
        const event = await Event.findOne({ _id: id })
        const user_id = req.body._id

        event.interested.push(user_id)
        await event.save()
        res.status(200).send({ message: "Going Done" })
    } catch (err) {
        res.status(500).send(err)
    }
})


// fetch individual image
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

// delete event
router.post('/delete', async (req, res) => {
    try {
        // pass event _id in body to delete
        await Event.deleteOne({ _id: req.body._id })
        res.status(200).send({ message: "Event Deleted" })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router