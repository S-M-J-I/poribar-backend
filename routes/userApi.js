const express = require('express')
const admin = require('../firebase/firebaseAuth')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const multer = require('multer')
const uploadAvatar = multer({ dest: 'images/avatar' })
const image_dirs = require('../middleware/image_filter')
const userMiddleware = require('../middleware/userMiddlewares')
const fs = require('fs')
const path = require('path')

router.post('/signup', uploadAvatar.single('avatar'), async (req, res) => {

    try {
        await userMiddleware.saveUser(req.body, req.file, "user")
        res.status(200).send("Registered User")
    } catch (err) {
        res.send(err)
    }
})


router.post('/profile/:uid', /* auth, */ async (req, res) => {
    try {
        const user = await userMiddleware.getUser(req.params.uid, "user")
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send("Something went wrong")
    }
})

router.post('/images', async (req, res) => {
    try {
        // req.body.reqFor: avatar
        // res.redirect('/profile/avatar')


        const { reqFor, filename } = req.body
        console.log(reqFor)
        console.log('dir: ', __dirname)

        const filepath = `${image_dirs.get(reqFor)}/${filename}`
        fp = path.join(__dirname, '../', filepath)

        console.log(fp)
        res.sendFile(fp, function (err) {
            res.status(500).send("Server more gese")
        })

    } catch (err) {
        console.log("HELLO BITCHES")
        res.status(500).send("Server more gese")
    }
})

router.post('/profile/update', auth, uploadAvatar.single('avatar'), async (req, res) => {
    try {
        // username, email, pass, ph no, photo
        // fields prefilled
        const { username, email, password, address, phone } = req.body

        let avatar = ''
        if (req.file.filename) {
            avatar = req.file.filename
        }

        await User.updateOne({ uid: req.body.uid }, { username, email, password, address, phone, avatar }, (err, docs) => {
            if (err) {
                throw err
            } else {
                console.log(docs)
            }
        })

        res.status(201).send("Updated")
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router