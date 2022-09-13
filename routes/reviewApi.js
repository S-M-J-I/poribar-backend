const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const User = require('../models/User')
const Nurse = require('../models/Nurse')

router.post('/post', async (req, res) => {
    try {
        const review = new Review(req.body)
        await review.save()
        const nurse = await Nurse.findOne({ _id: review.reviewed_to })
        const nursereviews = await Nurse.find({ reviewed_to: review.reviewed_to })
        nurse.rating = (nurse.rating + review.rating) / nursereviews.length
        await nurse.save()
        res.status(200).send({ message: "Review done" })
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/get/:id', async (req, res) => {
    const id = req.params.id
    try {
        const reviews = await Review.find({ reviewed_to: id })
        // get reviewer and save to reviewer
        res.status(200).send(reviews)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router