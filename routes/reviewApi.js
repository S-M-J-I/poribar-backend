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

router.post('/get-reviews-nurse/:id', async (req, res) => {
    const id = req.params.id
    try {
        const reviews = await Review.find({ reviewed_to: id })

        let revs = []
        reviews.forEach(async (review) => {
            const user = await User.findOne({ _id: review.reviewer })
            revs.push({
                user: user.name,
                ...review
            })
        })

        res.status(200).send(revs)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/get-reviews-user/:id', async (req, res) => {
    const id = req.params.id
    try {
        const reviews = await Review.find({ reviewer: id })

        let revs = []
        reviews.forEach(async (review) => {
            const user = await Nurse.findOne({ _id: review.reviewed_to })
            revs.push({
                nurse: user.name,
                ...review
            })
        })
        res.status(200).send(revs)
    } catch (err) {
        res.status(500).send(err)
    }
})



module.exports = router