const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

router.post('/create', async (req, res) => {
    try {
        const post = new Post(req.body)
        await post.save()
        res.status(200).send({ message: "Forum Post Created" })
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findOne({ _id: id })
        const editedPost = new Post(req.body)
        post = editedPost

        await post.save()
        res.status(200).send({ message: "Post edited" })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router