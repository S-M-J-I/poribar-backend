const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const User = require('../models/User')
const Nurse = require('../models/Nurse')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
router.post('/post', upload.none(), async (req, res) => {
    try {
        const review = new Review(req.body)
        await review.save()
        const nurse = await Nurse.findOne({ uid: review.reviewed_to })
        const nursereviews = await Review.find({ reviewed_to: review.reviewed_to })
        // console.log(nurse)
        nurse.rating = (nurse.rating + review.rating) / nursereviews.length
        // console.log(nurse)
        await nurse.save()
        // console.log('here')
        res.status(200).send({ status: "success" })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.post('/get-reviews-nurse/:id', async (req, res) => {
    const id = req.params.id
    try {
        const reviews = await Review.find({ reviewed_to: id })
        console.log(reviews)
        // const res=[]
        await Promise.all(reviews.map(async (review) => {
            const user = await User.findOne({ uid: review.reviewer })
            review.reviewer = user.name
        })
        )
        
        res.status(200).send(reviews)
    } catch (err) {
        console.log(err)
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